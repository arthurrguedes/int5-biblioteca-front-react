import React, { useState } from 'react';
import styles from './Contato.module.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    const resolveAfter2Sec = new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.promise(
        resolveAfter2Sec,
        {
          pending: 'Enviando sua mensagem...',
          success: 'Mensagem enviada com sucesso! Entraremos em contato.',
          error: 'Erro ao enviar mensagem.'
        }
    );

    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: '(usuário)', path: '#' },
    { label: 'Contato', path: '/contato' }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className={styles.pageTitle}>Fale Conosco</h1>

      <div className={styles.contentGrid}>
        
        {/* Informações de contato*/}
        <div className={styles.card}>
          <div className={styles.cardHeaderBadge}>Informações de Contato</div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}><FaMapMarkerAlt /> Endereço</div>
            <div className={styles.infoText}>
              R. Santa Luzia, 735 - 2º andar - Centro<br/>
              Rio de Janeiro - RJ<br/>
              CEP: 20030-041
            </div>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}><FaPhoneAlt /> Telefones</div>
            <div className={styles.infoText}>
              Tel: (21) 2018-9029<br/>
              WhatsApp: (21) 92018-9029
            </div>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}><FaEnvelope /> Email</div>
            <div className={styles.infoText}>
              contato@bibliotecamais.com.br<br/>
              suporte@bibliotecamais.com.br
            </div>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}><FaClock /> Horário de Atendimento</div>
            <div className={styles.infoText}>
              Segunda a Sexta: 08h às 17h
            </div>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.infoLabel}>Redes Sociais</div>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialItem}><FaInstagram /> Instagram</a>
              <a href="#" className={styles.socialItem}><FaFacebook /> Facebook</a>
              <a href="#" className={styles.socialItem}><FaTwitter /> Twitter</a>
            </div>
          </div>
        </div>

        {/* Formulário de mensagem */}
        <div className={styles.card}>
          <div className={styles.cardHeaderBadge}>Envie uma Mensagem</div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>Nome</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                className={styles.input} 
                placeholder="Digite seu nome completo"
                required
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={styles.input} 
                placeholder="seuemail@exemplo.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="assunto" className={styles.label}>Assunto</label>
              <input 
                type="text" 
                id="assunto" 
                name="assunto" 
                className={styles.input} 
                placeholder="Ex: Dúvida sobre reserva"
                value={formData.assunto}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="mensagem" className={styles.label}>Mensagem</label>
              <textarea 
                id="mensagem" 
                name="mensagem" 
                className={styles.textarea} 
                placeholder="Como podemos te ajudar?"
                required
                value={formData.mensagem}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>Enviar Mensagem</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contato;