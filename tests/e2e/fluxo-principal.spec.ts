import { expect, test } from "@playwright/test";

test.describe("fluxo principal da aluna", () => {
  test("e-mail sem compra aprovada vê a mensagem de suporte", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Seu e-mail de compra").fill("nao.comprou@teste.com");
    await page.getByRole("button", { name: "Receber link de acesso" }).click();
    await expect(page.getByText("Não encontramos uma compra aprovada")).toBeVisible();
  });

  test("área logada exige login", async ({ page }) => {
    await page.goto("/hoje");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("onboarding → hoje → concluir treino", async ({ page }) => {
    // Chega pelo quiz com os parâmetros, que pré-preenchem o onboarding
    await page.goto("/bem-vinda?nome=maria&local=casa&dias=3&objetivo=empinado&nivel=iniciante");
    await expect(page.getByRole("heading", { name: /Maria, deu tudo certo/ })).toBeVisible();
    await page.getByLabel("Seu e-mail de compra").fill("aluna@teste.com");
    await page.getByRole("button", { name: "Receber link de acesso" }).click();

    // Onboarding: 4 telas
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByLabel("Seu nome")).toHaveValue("Maria");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("radio", { name: /Em casa/ }).click();
    await expect(page.getByRole("heading", { name: /Quantos dias por/ })).toBeVisible();
    await expect(page.getByText("3", { exact: false }).first()).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("radio", { name: /Mais empinado/ })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("radio", { name: /Estou começando/ })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: "Gerar meu protocolo" }).click();
    await expect(page.getByRole("heading", { name: /começa hoje/ })).toBeVisible();
    await page.getByRole("link", { name: "Ver meu dia 1" }).click();

    // Hoje
    await expect(page).toHaveURL(/\/hoje$/);
    await expect(page.getByRole("heading", { name: "Oi, Maria!" })).toBeVisible();
    await expect(page.getByText("Dia 1 de 42")).toBeVisible();
    await expect(page.getByText("Fase 1 · Ativação")).toBeVisible();
    await expect(page.getByText("Refeições de hoje")).toBeVisible();

    // Marca o café da manhã
    const cafe = page.getByRole("checkbox", { name: /Café da manhã/ });
    await cafe.click();
    await expect(cafe).toHaveAttribute("aria-checked", "true");

    // Treino guiado do dia 1 (treino de hoje ou descanso ativo, conforme o dia da semana)
    await page.getByRole("link", { name: /Começar (treino|rotina)/ }).click();
    await expect(page).toHaveURL(/\/treino\/1$/);
    await page.getByRole("button", { name: /Começar (treino|rotina)/ }).click();
    await expect(page.getByRole("button", { name: "Sair do treino" })).toBeVisible();

    // Avança marcando a 1ª série de cada exercício até o fim
    for (let i = 0; i < 12; i++) {
      const concluir = page.getByRole("button", { name: "Concluir treino" });
      const serie1 = page.getByRole("button", { name: /^Série 1/ });
      if ((await serie1.getAttribute("aria-pressed")) === "false") await serie1.click();
      const pular = page.getByRole("button", { name: /Pular descanso|Concluir série agora/ });
      if (await pular.isVisible()) await pular.click();
      if (await concluir.isVisible()) {
        await concluir.click();
        break;
      }
      await page.getByRole("button", { name: "Próximo", exact: true }).click();
    }

    await expect(page.getByRole("heading", { name: /Mandou muito bem/ })).toBeVisible();
    await expect(page.getByText("Salvo na sua jornada")).toBeVisible();

    // Volta para Hoje: o dia aparece como concluído e a sequência conta 1
    await page.getByRole("link", { name: "Voltar para Hoje" }).click();
    await expect(page.getByText("Concluído!")).toBeVisible();
    await expect(page.getByLabel("Sequência")).toContainText("1");

    // Jornada: dia 1 concluído, dia 2 bloqueado
    await page.getByRole("link", { name: "Jornada" }).click();
    await expect(page.getByRole("link", { name: /Dia 1, .*concluído/ })).toBeVisible();
    await expect(page.getByRole("img", { name: /Dia 2, .*bloqueado/ })).toBeVisible();

    // O café marcado continua salvo no cardápio
    await page.getByRole("link", { name: "Cardápio" }).click();
    await expect(page.getByRole("checkbox", { name: /Café da manhã/ })).toHaveAttribute("aria-checked", "true");
  });
});
