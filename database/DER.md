# Modelo de Dados - GreenEnergy

O banco obrigatório é `projeto_integrador`. Ele foi criado para representar uma loja de produtos solares.

## Entidades obrigatórias

1. `cliente`: dados pessoais de quem compra.
2. `cadastro`: endereço e dados complementares do cliente.
3. `consulta`: pesquisas realizadas no catálogo.
4. `login`: credencial criptografada ligada ao cliente.
5. `compra`: intenção de compra confirmada.
6. `venda`: operação comercial gerada pela compra.
7. `nota_fiscal`: comprovante acadêmico interno da venda.
8. `carrinho_de_compra`: itens selecionados por um cliente.

Entidades auxiliares: `categoria`, `produto`, `item_carrinho` e `item_venda`.

## Cardinalidades

- cliente 1:1 cadastro
- cliente 1:1 login
- cliente 1:N consulta
- cliente 1:N carrinho_de_compra
- carrinho_de_compra 1:N item_carrinho
- produto 1:N item_carrinho
- categoria 1:N produto
- cliente 1:N compra
- carrinho_de_compra 1:N compra
- compra 1:1 venda
- venda 1:N item_venda
- produto 1:N item_venda
- venda 1:1 nota_fiscal

## Relacionamentos N:M

Carrinhos e produtos têm relacionamento N:M resolvido pela tabela `item_carrinho`.
Vendas e produtos têm relacionamento N:M resolvido pela tabela `item_venda`.

## DER textual

```text
[categoria] 1 ---- N [produto] N ---- 1 [item_carrinho] N ---- 1 [carrinho_de_compra]
                                                                  |
                                                                  N
                                                                  |
                                                              [cliente]
                                                                  1
                                                                  |
                                                          cadastro / login

[cliente] 1 ---- N [compra] 1 ---- 1 [venda] 1 ---- N [item_venda]
                                         |
                                         1
                                         |
                                  [nota_fiscal]
```
