# iMaster — Plataforma de Assistência Técnica

Aplicação web desenvolvida para uma assistência técnica especializada em dispositivos móveis, com foco na apresentação de serviços, consulta de preços e facilitação do contato entre clientes e técnicos.

## Visão geral

O sistema permite que clientes consultem opções de reparo de smartphones de acordo com a fabricante e o modelo do dispositivo, visualizando os serviços disponíveis e seus respectivos valores.

A plataforma foi desenvolvida para centralizar informações comerciais e simplificar o processo de solicitação de orçamento.

## Funcionalidades

- Consulta dinâmica de fabricantes e modelos de smartphones.
- Pesquisa de serviços de reparo e respectivos preços.
- Apresentação de categorias de manutenção e assistência técnica.
- Integração com WhatsApp para solicitação de orçamentos.
- Interface responsiva para diferentes dispositivos.
- Seções institucionais, diferenciais e perguntas frequentes.
- Persistência e consulta de dados utilizando banco de dados relacional.

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| Next.js 16 | Framework web e renderização no servidor |
| React 19 | Construção da interface |
| TypeScript | Tipagem estática |
| Prisma ORM | Mapeamento e acesso aos dados |
| PostgreSQL | Banco de dados relacional |
| Node.js | Ambiente de execução |
| bcryptjs | Recursos de hash de senhas |
| JSON Web Token | Autenticação baseada em tokens |

## Arquitetura

A aplicação utiliza a arquitetura do Next.js com separação entre componentes de interface, páginas e módulos responsáveis pelo acesso aos dados.

O Prisma é utilizado como camada de comunicação com o PostgreSQL, permitindo consultas estruturadas e gerenciamento das entidades da aplicação.

## Executando o projeto

### Pré-requisitos

- Node.js
- npm
- PostgreSQL

### Instalação

```bash
git clone https://github.com/IgorVinicin/Site_iMaster.git

cd Site_iMaster

npm install
```

Configure as variáveis de ambiente necessárias para a conexão com o banco de dados e os serviços da aplicação.

Crie o arquivo `.env` conforme a configuração do Prisma e do projeto.

### Banco de dados

Execute as migrações do Prisma conforme a configuração existente:

```bash
npx prisma migrate deploy
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

### Build de produção

```bash
npm run build
npm run start
```

## Objetivo técnico

O projeto foi desenvolvido com o objetivo de aplicar conceitos de desenvolvimento web moderno, integração com banco de dados relacional, renderização no servidor e organização de aplicações utilizando TypeScript e Next.js.

## Autor

**Igor Vinicius**

[GitHub](https://github.com/IgorVinicin)
