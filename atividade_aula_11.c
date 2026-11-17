/*
 * Atividade - Aula 11
 * Ex 1: velocidade media e matrizes
 * Ex 2: amostras de audio
 * Ex 3: lanchonete
 *
 * pra compilar: gcc -std=c11 -Wall -Wextra atividade_aula_11.c -o atividade
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

#define MAX_PRODUTOS 100

// a matriz fica guardada num vetor so, linha por linha
typedef struct {
    int linhas;
    int colunas;
    float *dados;
} Matriz;

typedef struct {
    short int *dados;
    int tamanho;
} VetorAudio;

typedef struct {
    char produto[60];
    float preco;
    int quantidade;
    float custo;
    int vendidos;
} Lanchonete;

Lanchonete produtos[MAX_PRODUTOS];
int qtd_produtos = 0;


/* ======================= EXERCICIO 1 ======================= */

float velocidade_media(float distancia, float tempo)
{
    // se o tempo for zero nao tem como dividir
    if (tempo == 0)
        return 0;

    return distancia / tempo;
}

Matriz criar_matriz(int linhas, int colunas)
{
    Matriz m;
    m.linhas = 0;
    m.colunas = 0;
    m.dados = NULL;

    if (linhas <= 0 || colunas <= 0)
        return m;

    // usei calloc pq ele ja deixa tudo com zero
    m.dados = (float *) calloc(linhas * colunas, sizeof(float));
    if (m.dados == NULL) {
        printf("Erro ao alocar a matriz\n");
        return m;
    }

    m.linhas = linhas;
    m.colunas = colunas;
    return m;
}

void liberar_matriz(Matriz *m)
{
    free(m->dados);
    m->dados = NULL;
    m->linhas = 0;
    m->colunas = 0;
}

float pegar_elemento(Matriz *m, int i, int j)
{
    return m->dados[i * m->colunas + j];
}

void colocar_elemento(Matriz *m, int i, int j, float valor)
{
    m->dados[i * m->colunas + j] = valor;
}

int mesmo_tamanho(Matriz *a, Matriz *b)
{
    if (a->linhas == b->linhas && a->colunas == b->colunas)
        return 1;
    return 0;
}

Matriz somar_matrizes(Matriz *a, Matriz *b)
{
    Matriz resultado = {0, 0, NULL};
    int i;

    if (!mesmo_tamanho(a, b)) {
        printf("Pra somar as matrizes tem que ter o mesmo tamanho\n");
        return resultado;
    }

    resultado = criar_matriz(a->linhas, a->colunas);
    if (resultado.dados == NULL)
        return resultado;

    for (i = 0; i < a->linhas * a->colunas; i++)
        resultado.dados[i] = a->dados[i] + b->dados[i];

    return resultado;
}

Matriz subtrair_matrizes(Matriz *a, Matriz *b)
{
    Matriz resultado = {0, 0, NULL};
    int i;

    if (!mesmo_tamanho(a, b)) {
        printf("Pra subtrair as matrizes tem que ter o mesmo tamanho\n");
        return resultado;
    }

    resultado = criar_matriz(a->linhas, a->colunas);
    if (resultado.dados == NULL)
        return resultado;

    for (i = 0; i < a->linhas * a->colunas; i++)
        resultado.dados[i] = a->dados[i] - b->dados[i];

    return resultado;
}

// multiplica posicao por posicao (nao e a multiplicacao de matriz normal)
Matriz multiplicar_elemento_a_elemento(Matriz *a, Matriz *b)
{
    Matriz resultado = {0, 0, NULL};
    int i;

    if (!mesmo_tamanho(a, b)) {
        printf("As matrizes precisam ter o mesmo tamanho\n");
        return resultado;
    }

    resultado = criar_matriz(a->linhas, a->colunas);
    if (resultado.dados == NULL)
        return resultado;

    for (i = 0; i < a->linhas * a->colunas; i++)
        resultado.dados[i] = a->dados[i] * b->dados[i];

    return resultado;
}

// divide posicao por posicao, se o divisor for 0 coloca 0 no lugar
Matriz dividir_elemento_a_elemento(Matriz *a, Matriz *b)
{
    Matriz resultado = {0, 0, NULL};
    int i;

    if (!mesmo_tamanho(a, b)) {
        printf("As matrizes precisam ter o mesmo tamanho\n");
        return resultado;
    }

    resultado = criar_matriz(a->linhas, a->colunas);
    if (resultado.dados == NULL)
        return resultado;

    for (i = 0; i < a->linhas * a->colunas; i++) {
        if (b->dados[i] == 0)
            resultado.dados[i] = 0;
        else
            resultado.dados[i] = a->dados[i] / b->dados[i];
    }

    return resultado;
}

// multiplicacao de matriz de verdade (linha x coluna)
Matriz multiplicar_matrizes(Matriz *a, Matriz *b)
{
    Matriz resultado = {0, 0, NULL};
    int i, j, k;
    float soma;

    // colunas de A tem que ser igual as linhas de B
    if (a->colunas != b->linhas) {
        printf("Nao da pra multiplicar essas matrizes\n");
        return resultado;
    }

    resultado = criar_matriz(a->linhas, b->colunas);
    if (resultado.dados == NULL)
        return resultado;

    for (i = 0; i < a->linhas; i++) {
        for (j = 0; j < b->colunas; j++) {
            soma = 0;
            for (k = 0; k < a->colunas; k++)
                soma += pegar_elemento(a, i, k) * pegar_elemento(b, k, j);
            colocar_elemento(&resultado, i, j, soma);
        }
    }

    return resultado;
}


/* ======================= EXERCICIO 2 ======================= */

VetorAudio criar_vetor_audio(short int amostras[], int tamanho)
{
    VetorAudio v;
    int i;

    v.tamanho = 0;
    v.dados = (short int *) malloc(tamanho * sizeof(short int));
    if (v.dados == NULL)
        return v;

    for (i = 0; i < tamanho; i++)
        v.dados[i] = amostras[i];

    v.tamanho = tamanho;
    return v;
}

void liberar_vetor_audio(VetorAudio *v)
{
    free(v->dados);
    v->dados = NULL;
    v->tamanho = 0;
}

// garante que o valor cabe num short int (-32768 ate 32767)
short int ajustar_valor(float valor)
{
    if (valor > SHRT_MAX)
        return SHRT_MAX;
    if (valor < SHRT_MIN)
        return SHRT_MIN;
    return (short int) valor;
}

// volume entre 0 e 1, devolve uma copia com o som mais baixo
VetorAudio reduzir_volume(VetorAudio *original, float volume)
{
    VetorAudio novo;
    int i;

    novo.dados = NULL;
    novo.tamanho = 0;

    if (volume < 0 || volume > 1) {
        printf("Volume invalido, tem que ser entre 0 e 1\n");
        return novo;
    }

    novo = criar_vetor_audio(original->dados, original->tamanho);
    for (i = 0; i < novo.tamanho; i++)
        novo.dados[i] = ajustar_valor(novo.dados[i] * volume);

    return novo;
}

// volume entre 0 e 2, se passar do limite do short ele trava no maximo
VetorAudio aumentar_volume(VetorAudio *original, float volume)
{
    VetorAudio novo;
    int i;

    novo.dados = NULL;
    novo.tamanho = 0;

    if (volume < 0 || volume > 2) {
        printf("Volume invalido, tem que ser entre 0 e 2\n");
        return novo;
    }

    novo = criar_vetor_audio(original->dados, original->tamanho);
    for (i = 0; i < novo.tamanho; i++)
        novo.dados[i] = ajustar_valor(novo.dados[i] * volume);

    return novo;
}

// tira as amostras que estao entre -33 e 33 (som que nao da pra ouvir)
VetorAudio remover_som_imperceptivel(VetorAudio *original)
{
    VetorAudio novo;
    int i;

    novo.tamanho = 0;
    novo.dados = (short int *) malloc(original->tamanho * sizeof(short int));
    if (novo.dados == NULL)
        return novo;

    for (i = 0; i < original->tamanho; i++) {
        if (original->dados[i] < -33 || original->dados[i] > 33) {
            novo.dados[novo.tamanho] = original->dados[i];
            novo.tamanho++;
        }
    }

    return novo;
}

void imprimir_audio(VetorAudio *v)
{
    int i;
    for (i = 0; i < v->tamanho; i++)
        printf("%d ", v->dados[i]);
    printf("\n");
}


/* ======================= EXERCICIO 3 ======================= */

// limpa o que sobrou no teclado (o \n do scanf)
void limpar_buffer(void)
{
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void inserir_produto(void)
{
    Lanchonete *p;

    if (qtd_produtos >= MAX_PRODUTOS) {
        printf("Nao cabe mais produto!\n");
        return;
    }

    p = &produtos[qtd_produtos];

    printf("Nome do produto: ");
    scanf(" %59[^\n]", p->produto);
    printf("Preco: ");
    scanf("%f", &p->preco);
    printf("Quantidade em estoque: ");
    scanf("%d", &p->quantidade);
    printf("Custo de cada um: ");
    scanf("%f", &p->custo);
    printf("Quantos foram vendidos: ");
    scanf("%d", &p->vendidos);
    limpar_buffer();

    qtd_produtos++;
    printf("Produto cadastrado!\n");
}

void mostrar_lucro_e_custo(void)
{
    float lucro = 0, custo = 0;
    int i;

    for (i = 0; i < qtd_produtos; i++) {
        lucro += produtos[i].vendidos * produtos[i].preco;
        // custo conta o que ta no estoque + o que ja foi vendido
        custo += (produtos[i].quantidade + produtos[i].vendidos) * produtos[i].custo;
    }

    printf("Lucro total: R$ %.2f\n", lucro);
    printf("Custo total: R$ %.2f\n", custo);
}

void listar_produtos(void)
{
    int i;

    if (qtd_produtos == 0) {
        printf("Nenhum produto cadastrado ainda\n");
        return;
    }

    for (i = 0; i < qtd_produtos; i++) {
        printf("\n--- Produto %d ---\n", i + 1);
        printf("Nome: %s\n", produtos[i].produto);
        printf("Preco: R$ %.2f\n", produtos[i].preco);
        printf("Estoque: %d\n", produtos[i].quantidade);
        printf("Custo: R$ %.2f\n", produtos[i].custo);
        printf("Vendidos: %d\n", produtos[i].vendidos);
    }
}

void mostrar_mais_vendido(void)
{
    int i, maior = 0;

    if (qtd_produtos == 0) {
        printf("Nenhum produto cadastrado ainda\n");
        return;
    }

    for (i = 1; i < qtd_produtos; i++) {
        if (produtos[i].vendidos > produtos[maior].vendidos)
            maior = i;
    }

    printf("O mais vendido foi %s, com %d unidades\n",
           produtos[maior].produto, produtos[maior].vendidos);
}

void menu_lanchonete(void)
{
    int opcao;

    do {
        printf("\n===== LANCHONETE =====\n");
        printf("1 - Cadastrar produto\n");
        printf("2 - Ver lucro e custo\n");
        printf("3 - Listar produtos\n");
        printf("4 - Ver o mais vendido\n");
        printf("0 - Sair\n");
        printf("Escolha: ");

        if (scanf("%d", &opcao) != 1)
            opcao = -1;
        limpar_buffer();

        switch (opcao) {
            case 1:
                inserir_produto();
                break;
            case 2:
                mostrar_lucro_e_custo();
                break;
            case 3:
                listar_produtos();
                break;
            case 4:
                mostrar_mais_vendido();
                break;
            case 0:
                printf("Saindo...\n");
                break;
            default:
                printf("Opcao invalida\n");
        }
    } while (opcao != 0);
}


int main(void)
{
    short int amostras[16] = {1500, 2800, 7800, 15522, 18320, 15488, 7777, 2422,
                              1300, 30, -30, -1428, -2600, -7600, -15428, -18822};
    VetorAudio audio, reduzido, aumentado, filtrado;

    // ex 1
    printf("Velocidade media (120 km em 2 h): %.2f km/h\n\n", velocidade_media(120, 2));

    // ex 2
    audio = criar_vetor_audio(amostras, 16);
    reduzido = reduzir_volume(&audio, 0.9);
    aumentado = aumentar_volume(&audio, 1.1);
    filtrado = remover_som_imperceptivel(&audio);

    printf("Audio original:\n");
    imprimir_audio(&audio);
    printf("Volume 0.9:\n");
    imprimir_audio(&reduzido);
    printf("Volume 1.1:\n");
    imprimir_audio(&aumentado);
    printf("Sem os valores entre -33 e 33:\n");
    imprimir_audio(&filtrado);

    liberar_vetor_audio(&audio);
    liberar_vetor_audio(&reduzido);
    liberar_vetor_audio(&aumentado);
    liberar_vetor_audio(&filtrado);

    // ex 3
    menu_lanchonete();

    return 0;
}
