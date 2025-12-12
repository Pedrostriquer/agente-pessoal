import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-wrapper fade-in">
      <div className="privacy-header">
        <h1>Política de Privacidade</h1>
        <p className="privacy-subtitle">
          Serviço: <strong>myblutler.com.br</strong><br />
          Última atualização: 12 de dezembro de 2025
        </p>
      </div>

      <div className="privacy-section">
        <h2>Resumo</h2>
        <p>
          Esta política ajudará você a entender quais dados coletamos, por que os coletamos e quais são seus direitos em relação a eles.
          Ao utilizar nossos serviços, você confia a nós suas informações. Entendemos que isso é uma grande responsabilidade e trabalhamos duro para proteger essas informações.
        </p>
      </div>

      <div className="privacy-section">
        <h2>Proprietário e Controlador de Dados</h2>
        <div className="contact-box">
          <p>
            <strong>Software House Caiuã de Mello</strong><br />
            CNPJ: 57.326.249/0001-09<br />
            Rua Lídio Oltramari, 1699 - Fraron<br />
            Pato Branco - PR, 85503-381<br />
            Brasil
          </p>
          <p>
            <strong>E-mail de contato:</strong> caiua@softwarehousecaiuademello.com.br
          </p>
        </div>
      </div>

      <div className="privacy-section">
        <h2>Tipos de Dados Coletados</h2>
        <p>Entre os tipos de Dados Pessoais que este Aplicativo coleta, por si mesmo ou através de terceiros, existem:</p>
        <ul>
          <li>Rastreadores e Cookies;</li>
          <li>Dados de uso;</li>
          <li>Endereço de e-mail;</li>
          <li>Informações do dispositivo;</li>
          <li>Dados de contas de serviços terceiros (Google).</li>
        </ul>
        <p>
          Os Dados Pessoais poderão ser fornecidos livremente pelo Usuário, ou, no caso dos Dados de Utilização, coletados automaticamente ao se utilizar este Aplicativo.
          A menos que especificado diferentemente, todos os Dados solicitados por este Aplicativo são obrigatórios e a falta de fornecimento destes Dados poderá impossibilitar este Aplicativo de fornecer os seus Serviços.
        </p>
      </div>

      <div className="privacy-section">
        <h2>Acesso a Contas de Serviços de Terceiros</h2>
        <p>
          Este tipo de serviço permite a este Aplicativo acessar os Dados da sua conta com um serviço terceiro e realizar ações com os mesmos.
          Estes serviços <strong>não são ativados automaticamente</strong>, necessitando de autorização explícita do Usuário (login via OAuth).
        </p>

        <h3>1. Acesso à conta Google (Drive, Sheets, Docs e Gmail)</h3>
        <p>
          Este serviço permite que este Aplicativo se conecte com a conta do Usuário nos serviços do Google para fornecer funcionalidades de automação e gestão.
        </p>
        <ul>
          <li><strong>Google Gmail:</strong> Leitura e envio de e-mails para automação de respostas e organização de caixa de entrada.</li>
          <li><strong>Google Drive, Sheets e Docs:</strong> Criação, leitura e edição de arquivos, planilhas e documentos para gestão de informações do usuário.</li>
        </ul>
        <p><strong>Dados Pessoais processados:</strong> Dados de uso, E-mail, Conteúdo de arquivos e documentos.</p>
        <p><strong>Lugar de processamento:</strong> EUA – <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Política de Privacidade Google</a></p>

        <h3>2. Google Calendar</h3>
        <p>
          Permite a este Aplicativo acessar e gerenciar eventos na agenda do usuário para funcionalidades de agendamento e resumo de reuniões.
        </p>
        <p><strong>Dados Pessoais processados:</strong> Dados de uso, Detalhes de eventos (data, hora, participantes).</p>
      </div>

      <div className="privacy-section">
        <h2>Finalidades do Processamento</h2>
        <p>Os Dados relativos ao Usuário são coletados para permitir que o Proprietário preste seu Serviço, cumpra suas obrigações legais, responda a solicitações de execução, proteja seus direitos e interesses, bem como:</p>
        <ul>
          <li>Acesso a contas de serviços de terceiros (Google Workspace);</li>
          <li>Visualizar conteúdo de plataformas externas;</li>
          <li>Contatar o Usuário;</li>
          <li>Gestão de produtividade e finanças pessoais.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>Modo e Local de Processamento</h2>
        <p>
          <strong>Método de processamento:</strong> O processamento dos Dados é realizado utilizando computadores e/ou ferramentas de TI habilitadas, seguindo procedimentos organizacionais e meios estritamente relacionados com os fins indicados.
        </p>
        <p>
          <strong>Segurança:</strong> O Proprietário toma as medidas de segurança adequadas para impedir o acesso não autorizado, divulgação, alteração ou destruição não autorizada dos Dados.
        </p>
        <p>
          <strong>Período de conservação:</strong> Os Dados Pessoais serão tratados e armazenados pelo tempo necessário para as finalidades para as quais foram coletados.
        </p>
      </div>

      <div className="privacy-section">
        <h2>Direitos dos Usuários (LGPD / GDPR)</h2>
        <p>Os Usuários poderão exercer determinados direitos a respeito dos seus Dados processados pelo Proprietário:</p>
        <ul>
          <li>Retirar a sua anuência a qualquer momento;</li>
          <li>Objetar o processamento dos seus Dados;</li>
          <li>Acessar os seus Dados;</li>
          <li>Verificar e pedir retificação;</li>
          <li>Restringir o processamento dos seus Dados;</li>
          <li>Ter os seus Dados Pessoais apagados ou retirados;</li>
          <li>Registrar uma reclamação perante a autoridade competente.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>Informações Adicionais</h2>
        <p>
          <strong>Logs do sistema e manutenção:</strong> Para fins de operação e manutenção, este Aplicativo e quaisquer serviços de terceiros poderão coletar arquivos que gravam a interação com este Aplicativo (logs do sistema) ou usar outros Dados Pessoais (tais como endereço IP).
        </p>
        <p>
          <strong>Mudanças nesta política:</strong> O Proprietário se reserva o direito de fazer alterações nesta política de privacidade a qualquer momento, notificando seus Usuários nesta página.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;