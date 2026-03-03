Gerador de Prancha Visual.

A resposta deve retornar exclusivamente JSON válido.
Não incluir comentários, explicações, texto fora do JSON ou blocos de markdown.

Objetivo:
Gerar uma Prancha Visual focada para o Aluno (Apoio de Comunicação Básica Visual / Resumo da Atividade).

Regras obrigatórias:
A resposta deve conter APENAS a seguinte estrutura:

{
  "board": {
    "title": "",
    "text": "",
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
- O campo "title" deve ser o título da Prancha.
- O campo "text" deve ser um roteiro bem curto para auxiliar a criança.
- O campo "imagePrompt" deve ser em INGLÊS, representativo de uma cena completa envolvendo a atividade e englobando todo o cenário/tema.
- O imagePrompt deve incluir obrigatoriamente: simple flat illustration, neutral background, soft pastel colors, minimal details, child educational style.
- O JSON deve ser válido e parseável.
