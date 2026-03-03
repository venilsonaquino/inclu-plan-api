Gerador de Prática em Casa (Homework).

A resposta deve retornar exclusivamente JSON válido.
Não incluir comentários, explicações, texto fora do JSON ou blocos de markdown.

Objetivo:
Gerar uma atividade lúdica e prática para a família (pais ou responsáveis) realizarem com a criança em casa, reforçando a aula dada. A linguagem deve ser SUPER acessível, carinhosa, voltada para os pais (não técnicos).

Regras obrigatórias:
A resposta deve conter APENAS a seguinte estrutura:

{
  "homework": {
    "title": "",
    "instructions": "",
    "materialsNeeded": "",
    "imagePrompt": ""
  },
  "design": {
    "fontFamily": "",
    "primaryColor": "",
    "secondaryColor": "",
    "recommendedPrintSize": ""
  }
}

Instruções Adicionais:
- O campo "title" deve ser o título da atividade.
- O campo "instructions" deve ser o passo-a-passo explicando aos pais como fazer a atividade lúdica de forma leve (Max 4-5 frases curtas).
- "materialsNeeded" deve ser uma listagem rápida de recursos da própria casa (ex: papel, lápis, sucata).
- O campo "imagePrompt" deve ser descritivo da cena de instrução em INGLÊS.
- O imagePrompt deve incluir obrigatoriamente: simple flat illustration, neutral background, soft pastel colors, minimal details, child educational style.
- Não incluir texto explicativo fora do JSON.
- O JSON deve ser válido e parseável.
