# GreenEnergy

Loja full stack acadêmica de equipamentos de energia solar, desenvolvida com HTML, CSS, JavaScript, Node.js, Express, MariaDB e arquitetura MVC.

## Requisitos

- Node.js 20 ou superior
- MariaDB

## Instalação

```bash
npm install
```

Crie o arquivo `.env` usando `.env.example` como base.
O cadastro de produtos está disponível publicamente e não exige login.

```bash
npm run db:schema
npm run db:seed
npm start
```

Acesse `http://localhost:3000`.

### Problemas de acesso ao MariaDB

Se o servidor informar `AUTH_SWITCH_PLUGIN_ERROR`, ajuste `DB_PASSWORD` no `.env`
e confira o usuário com permissão de acesso TCP no MariaDB. Para uma instalação
nova, crie um usuário próprio em vez de depender da conta `root`:

```sql
CREATE USER 'greenenergy'@'localhost' IDENTIFIED BY 'uma_senha_segura';
GRANT ALL PRIVILEGES ON projeto_integrador.* TO 'greenenergy'@'localhost';
FLUSH PRIVILEGES;
```

Depois altere `DB_USER=greenenergy` e `DB_PASSWORD` no `.env`.

## Conta demonstrativa

- E-mail: `cliente@greenenergy.com`
- Senha: `123456`

## Estrutura

- `src/`: frontend HTML, CSS e JavaScript.
- `backend/`: servidor, configuração, modelos, controllers, rotas e middleware.
- `database/`: schema, dados demonstrativos, consultas e documentação do banco.

## Testes manuais

1. Abra a página inicial e consulte os produtos.
2. Faça cadastro ou entre com a conta demonstrativa.
3. Abra um produto e adicione-o ao carrinho.
4. Altere ou remova itens.
5. Finalize o checkout.
6. Consulte o histórico de pedidos.
