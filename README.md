# TP de Engenharia Web 2023 - Plataforma de Gestão e Disponibilização de Recursos Educativos (PGDRE)

## Elementos do grupo de trabalho
- Gonçalo Martins dos Santos - a95354
- Telmo José Pereira Maciel - a96569

## Introdução
O nosso grupo, para o trabalho prático de Engenharia Web do ano 2023, decidiu
abordar o tema da Plataforma de Gestão e Disponibilização de Recursos Educativos ou, de forma abreviada, *PGDRE*.

O objetivo para este tema era desenvolver uma plataforma que servisse para partilhar e gerir recursos educacionais. Foi proposto o modelo *OAIS*
(Open Archival Information System) como sistema para divulgação, disseminação, gestão e armazenamento dos recursos educativos, sistema o qual, decidimos seguir e implementar no nosso trabalho.

Neste relatório vamos abordar como está organizada a aplicação, de que maneira os
dados são guardados e geridos, as funcionalidades implementadas na plataforma e uma
pequena demonstração da mesma.

## Estrutura/Arquitetura da plataforma
Na diretoria principal da nossa plataforma, podemos reparar que esta é construída
por 3 servidores: APP_SERVER, API_SERVER e AUTH_SERVER. Cada um serve um propósito bem definido e a comunicação entre eles é fundamental para conceber a plataforma
pretendida.

### Interação entre as diferentes componentes
Nesta secção vamos passar a explicar melhor como os 3 servidores se relacionam
para responder aos vários pedidos que um utilizador possa fazer. Analisemos o seguinte diagrama:

![estrutura](https://github.com/goncalosantos3/ENGWEB2023-Projeto/assets/73351929/14d9aca5-1ec0-4fda-9922-82161ce4fc0c)
