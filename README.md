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

Tendo como refenrência o diagrama, vamos passar à explicação detalhada de cada servidor.

#### APP_SERVER
O APP_SERVER é o principal servidor na plataforma por ser o servidor que
conecta todas as outras componentes e também por ser o servidor que comunica diretamente com o utilizador.

Este servidor trata de todos os pedidos do utilizador e usa como suporte os outros dois servidores (AUTH_SERVER e API_SERVER) para dar resposta aos pedidos do utilizador.

Mais concretamente, este servidor faz pedidos ao API_SERVER para obter informação sobre os recursos, as notícias e posts. Faz pedidos ao AUTH_SERVER para obter informação sobre os utilizadores para puder fazer várias coisas como autenticar utilizadores, editar os perfis e ter níveis de acesso diferentes para cada utilizador (admin, producer e consumer).

#### API_SERVER
O API_SERVER é o servidor responsável por gerir toda a informação sobre os
recursos, os posts e as notícias. Gerir esta informação inclui: criar, editar, listar e remover recursos, notícias e posts. Para isso, foram criadas 3 coleções diferentes na base de dados da plataforma PGDRE cada uma para cada tipo de entidade.

Ao contrário do APP_SERVER, este servidor não gera qualquer tipo de interface
apenas responde aos pedidos deste servidor consultando a base de dados.

#### AUTH_SERVER
O AUTH_SERVER é o servidor responsável por gerir toda a informação sobre os
utilizadores. Gerir esta informação inclui: criar, editar, listar, desativar e ativar utilizadores. Para isso, foi criada 1 coleção na base de dados da plataforma PGDRE para armazenar a informação dos diversos utilizadores.

Para além disto, este servidor é responsável por gerar um jwt (Json Web Token)
para cada utilizador que se autenticar com sucesso na plataforma. Este token é posteriormente passado para o APP_SERVER para que o cliente possa-o guardar nas suas cookies. Este token serve para todos os servidores verificarem se um dado utilizador está autenticado ou não e, para além disso, verificarem o seu username, o seu nível e se está ativo ou não (todos estes campos são guardados no payload do token). Desta forma, a autenticação de utilizadores e os diferentes níveis de acesso dos mesmos são implementados.

Ao contrário do APP_SERVER, este servidor não gera qualquer tipo de interface
apenas responde aos pedidos deste servidor consultando a base de dados.

## Persistência de Dados