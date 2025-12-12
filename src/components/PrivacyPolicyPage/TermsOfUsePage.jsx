
import React from 'react';
import './PrivacyPolicyPage.css'; // Reutilizando o estilo existente

const TermsOfUsePage = () => {
  return (
    <div className="privacy-wrapper fade-in">
      <div className="privacy-header">
        <h1>Termos de Uso</h1>
        <p className="privacy-subtitle">
          Plataforma: <strong>MyButler</strong><br />
          Última atualização: 12 de dezembro de 2025
        </p>
      </div>

      <div className="privacy-section">
        <p>
          Bem-vindo ao MyButler!
        </p>
        <p>
          Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma SaaS MyButler, acessível através do site e aplicativo ("Plataforma"), operada por <strong>Software House Caiuã de Mello</strong>, inscrita no CNPJ sob o nº <strong>57.326.249/0001-09</strong>, com sede em <strong>R. Lídio Oltramari, 1699 - Fraron, Pato Branco - PR, 85503-381</strong>.
        </p>
        <p>
          Ao acessar ou utilizar nossos serviços, você ("Usuário") concorda expressamente com estes Termos. Se você não concordar com qualquer disposição aqui presente, não deverá utilizar a Plataforma.
        </p>
      </div>

      <div className="privacy-section">
        <h2>1. O Serviço</h2>
        <p>
          O MyButler é um Software as a Service (SaaS) projetado para atuar como um assistente pessoal e financeiro integrado. Nossos serviços incluem, mas não se limitam a:
        </p>
        <ul>
          <li>Organização financeira pessoal e empresarial.</li>
          <li>Agendamento de compromissos e gestão de calendário.</li>
          <li>Criação e edição de documentos e planilhas assistida por Inteligência Artificial (IA).</li>
          <li>Gestão de arquivos em nuvem.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>2. Integração com Serviços de Terceiros (Google)</h2>
        <p>
          Para funcionar corretamente, o MyButler necessita de integração com serviços do Google (Google Calendar, Google Drive, Google Sheets, Google Docs, Gmail).
        </p>
        <ul>
          <li>
            <strong>2.1. Autorização de Acesso:</strong> Ao utilizar o MyButler, você concede permissão explícita para que nossa aplicação acesse, leia, edite e crie dados em sua conta Google, estritamente dentro dos limites necessários para a execução das funcionalidades solicitadas por você.
          </li>
          <li>
            <strong>2.2. Limitação de Responsabilidade:</strong> O MyButler não tem controle sobre as políticas, disponibilidade ou desempenho dos serviços do Google. Alterações nas APIs do Google ou interrupções nos serviços deles podem afetar o funcionamento do MyButler.
          </li>
          <li>
            <strong>2.3. Conformidade com a Política de Dados do Usuário do Google:</strong> O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo aderirão à Política de Dados do Usuário dos Serviços de API do Google, incluindo os requisitos de "Uso Limitado".
          </li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>3. Cadastro e Segurança da Conta</h2>
        <ul>
          <li><strong>3.1. Veracidade dos Dados:</strong> Para utilizar o serviço, o Usuário deve fornecer informações exatas, precisas e verdadeiras.</li>
          <li><strong>3.2. Credenciais:</strong> O Usuário é o único responsável pela segurança de suas credenciais de acesso. O MyButler utiliza criptografia avançada (hashing) para proteção de senhas. Recomendamos que você não compartilhe sua senha com terceiros.</li>
          <li><strong>3.3. Notificação:</strong> O Usuário deve notificar imediatamente o MyButler sobre qualquer uso não autorizado de sua conta ou violação de segurança.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>4. Uso de Inteligência Artificial</h2>
        <ul>
          <li><strong>4.1. Geração de Conteúdo:</strong> O MyButler utiliza modelos de Inteligência Artificial para gerar documentos, textos e insights. Embora nos esforcemos para oferecer precisão, a IA pode, ocasionalmente, gerar informações incorretas ou imprecisas ("alucinações").</li>
          <li><strong>4.2. Responsabilidade:</strong> Cabe ao Usuário revisar e validar todo o conteúdo, documentos ou planilhas gerados pela IA antes de utilizá-los para fins legais, financeiros ou profissionais. O MyButler não se responsabiliza por erros factuais em documentos gerados automaticamente.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>5. Proteção de Dados e Privacidade (LGPD)</h2>
        <p>
          A sua privacidade é fundamental para nós. O tratamento de seus dados pessoais ocorre em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
        </p>
        <ul>
          <li><strong>5.1. Coleta e Uso:</strong> Coletamos apenas os dados necessários para a prestação do serviço. Para detalhes completos sobre como coletamos, armazenamos e protegemos seus dados, consulte nossa <a href="/privacy">Política de Privacidade</a>.</li>
          <li><strong>5.2. Segurança:</strong> Implementamos medidas técnicas e organizacionais (como criptografia em trânsito e repouso) para proteger seus dados contra acesso não autorizado.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>6. Planos, Pagamentos e Cancelamento</h2>
        <ul>
          <li><strong>6.1. Assinatura:</strong> O MyButler é oferecido através de planos de assinatura (mensal, anual, etc.). Os valores e recursos de cada plano estão descritos na página de preços do site/app.</li>
          <li><strong>6.2. Renovação:</strong> Salvo cancelamento prévio, a assinatura será renovada automaticamente pelo mesmo período contratado.</li>
          <li><strong>6.3. Cancelamento:</strong> O Usuário pode cancelar a assinatura a qualquer momento através do painel de controle. O serviço permanecerá ativo até o fim do ciclo de faturamento atual. Não oferecemos reembolso por períodos parciais não utilizados, exceto se exigido por lei (Direito de Arrependimento de 7 dias).</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>7. Propriedade Intelectual</h2>
        <ul>
          <li><strong>7.1. Da Plataforma:</strong> Todo o design, código-fonte, logotipos, e software do MyButler são de propriedade exclusiva da Software House Caiuã de Mello.</li>
          <li><strong>7.2. Do Usuário:</strong> Todo o conteúdo, dados financeiros e documentos criados ou importados pelo Usuário permanecem sendo de propriedade exclusiva do Usuário. O MyButler não reivindica direitos autorais sobre o conteúdo gerado por você.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>8. Responsabilidades e Limitações</h2>
        <ul>
          <li><strong>8.1. Isenção sobre Finanças:</strong> O MyButler é uma ferramenta de organização. Não oferecemos consultoria financeira, jurídica ou contábil. Decisões financeiras baseadas em dados da plataforma são de inteira responsabilidade do Usuário.</li>
          <li><strong>8.2. Disponibilidade:</strong> Embora busquemos 99,9% de uptime, não garantimos que o serviço será ininterrupto ou livre de erros. Manutenções programadas ou falhas em serviços terceiros (como AWS ou Google) podem ocorrer.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>9. Alterações nos Termos</h2>
        <p>
          O MyButler reserva-se o direito de alterar estes Termos a qualquer momento. Notificaremos os usuários sobre alterações significativas via e-mail ou aviso na plataforma. O uso contínuo do serviço após as alterações constitui aceitação dos novos termos.
        </p>
      </div>

      <div className="privacy-section">
        <h2>10. Foro e Legislação Aplicável</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de <strong>Pato Branco - PR</strong> para dirimir quaisquer dúvidas ou litígios oriundos deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUsePage;