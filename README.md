# Inventory Check Demo

**Estágio: experimental / em teste. Demonstração parcial sanitizada, não pronta para produção.**

Uma demonstração local de conferência de estoque: entrada de código, contagem por unidade ou embalagem e comparação com uma quantidade esperada fictícia.

## O que funciona

- Catálogo de três produtos inteiramente fictícios.
- Validação do dígito verificador EAN-13 antes da contagem.
- Leitor USB em modo teclado, digitação ou seleção do código de exemplo.
- Conversão de pacotes e caixas em unidades, correção de quantidade e histórico da sessão.
- Diferenças entre quantidade contada e esperada; reinício da demonstração.
- Leitura opcional pela câmera usando `BarcodeDetector`, somente quando o navegador oferecer EAN-13. Duas detecções consecutivas confirmam a leitura; a câmera para após uma leitura.
- Layout compacto, campos rotulados, mensagens acessíveis e tabela com rolagem horizontal em telas pequenas.

## Executar

Não há dependências de aplicação. Com Python 3 instalado, dentro desta pasta:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000` no navegador. Não use este servidor de desenvolvimento para disponibilização pública. Para hospedagem, os arquivos são estáticos e podem ser servidos por HTTPS.

1. Clique em **Usar código** ou use `2000000000015`, um identificador inventado.
2. Escolha duas embalagens de seis unidades e adicione. A contagem será 12.
3. Corrija para 10. O histórico registra a diferença de -2.
4. Reinicie para voltar ao catálogo inicial.

A leitura de câmera requer permissão e contexto seguro (HTTPS ou localhost). Seu suporte depende do navegador; não há biblioteca externa ou fallback remoto. A digitação continua disponível quando a câmera não funcionar. O acesso pelo IP local de outro aparelho em HTTP pode não permitir câmera. Não foi validado em iPhone físico.

## Testar

Com Node.js 18 ou superior:

```sh
node --test tests/*.test.cjs
```

Os testes cobrem regras e validação, não certificam desempenho de câmera em dispositivos reais.

## Arquitetura e origem

- `core.js`: validadores de código e adaptador de estado em memória.
- `app.js`: interface, tabela, correções e câmera opcional.
- `index.html` e `style.css`: apresentação independente de bibliotecas externas.

Esta é uma **adaptação demonstrativa reduzida**, não uma cópia funcional completa do sistema operacional original. Preserva a lógica observada de leitura, soma, conversão por embalagem e registro de correções. Os validadores de checksum foram extraídos de código revisado; o adaptador local, os dados e a interface simplificada foram preparados para esta demonstração.

A origem não possui licença raiz identificada. Nenhuma licença de código aberto é atribuída automaticamente a esta versão; a autorização de publicação e eventual licença devem ser confirmadas pelo titular antes da distribuição. Não inclui bibliotecas de terceiros vendorizadas.

## Limites e privacidade

Não contém integrações de produção, autenticação, configuração operacional, planilhas, bases reais, logs, histórico Git ou geradores de scripts de alteração remota. Não sincroniza, não grava estoque real e não importa dados do usuário. Nenhuma chamada de rede é realizada pela aplicação; somente os próprios arquivos estáticos são carregados pelo navegador. A câmera processa imagens localmente. A contagem permanece apenas na memória da aba e é perdida ao recarregar. O histórico visual mostra as últimas 20 alterações da sessão.

Recursos do sistema original, como sincronização multiusuário, importação de planilhas, manutenção de códigos e atualização de lotes, foram intencionalmente excluídos. Não há promessa de equivalência, auditoria de segurança integral ou prontidão para operação comercial.
