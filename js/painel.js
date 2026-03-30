document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. BANCO DE DADOS SIMULADO (LOCALSTORAGE)
    // ==========================================
    const getChamados = () => JSON.parse(localStorage.getItem('chamados')) || [];
    const saveChamados = (chamados) => localStorage.setItem('chamados', JSON.stringify(chamados));

    // ==========================================
    // 1. GESTÃO DE SESSÃO E PERFIL
    // ==========================================
    const displayElement = document.getElementById("user-display");
    const isTecnico = !!sessionStorage.getItem("matriculaTecnico");
    const isColaborador = !!sessionStorage.getItem("matriculaColaborador");
    
    if (isColaborador) {
        if(displayElement) displayElement.textContent = "Matrícula: " + sessionStorage.getItem("matriculaColaborador");
    } else if (isTecnico) {
        if(displayElement) displayElement.textContent = "Matrícula: " + sessionStorage.getItem("matriculaTecnico");
    } else {
        window.location.href = "../index.html"; 
    }

    const btnSair = document.getElementById("btn-sair");
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "../index.html";
        });
    }

    // ==========================================
    // 2. RENDERIZAÇÃO DA LISTA DE CHAMADOS
    // ==========================================
    const containerLista = document.querySelector('.chamados-list');
    const containerHeader = document.querySelector('.header-section');

    function renderizarLista() {
        if (!containerLista) return; 

        const chamados = getChamados();
        containerLista.innerHTML = ''; 

        // Atualiza Total
        let badgeTotal = document.querySelector('.badge-total');
        if (!badgeTotal && containerHeader) {
            badgeTotal = document.createElement('span');
            badgeTotal.className = 'badge-total';
            containerHeader.appendChild(badgeTotal);
        }
        
        const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
        if (badgeTotal) {
            badgeTotal.textContent = `TOTAL ABERTOS: ${chamadosAbertos}`;
        }

        if (chamados.length === 0) {
            containerLista.innerHTML = '<p style="color: #A0A0A0; font-weight: 500; text-align: center; margin-top: 20px;">Nenhum chamado aberto no momento.</p>';
            return;
        }

        chamados.slice().reverse().forEach(chamado => {
            const card = document.createElement('div');
            card.className = 'chamado-card';
            card.style.flexDirection = 'column'; 
            card.style.alignItems = 'stretch';
            
            const tipoSeguro = chamado.tipoServico ? chamado.tipoServico.toUpperCase() : 'CHAMADO GERAL';
            const localSeguro = chamado.local ? chamado.local : 'Não informado';
            const reqSeguro = chamado.requisitante ? chamado.requisitante : 'Não informado';
            const urgSeguro = chamado.urgencia ? chamado.urgencia.toUpperCase() : 'NORMAL';
            const centroCustoSeguro = chamado.centroCusto ? chamado.centroCusto : 'Não informado';
            const tecnicoSeguro = chamado.tipoTecnico ? chamado.tipoTecnico.toUpperCase() : 'NÃO ESPECIFICADO';
            const descSegura = chamado.descricao ? chamado.descricao : 'Sem descrição.';
            const dataSegura = chamado.dataCriacao ? chamado.dataCriacao : '';

            const tituloFormatado = `${tipoSeguro} - ${localSeguro}`;
            
            let acoesHtml = '';
            if (isTecnico) {
                acoesHtml = `
                    <div class="chamado-actions" data-id="${chamado.id}" style="margin-top: 15px; border-top: 1px solid #F0F0F0; padding-top: 15px; width: 100%; justify-content: flex-end;">
                        <select class="status-select" data-status="${chamado.status}">
                            <option value="aberto" ${chamado.status === 'aberto' ? 'selected' : ''}>Aberto</option>
                            <option value="andamento" ${chamado.status === 'andamento' ? 'selected' : ''}>Em Andamento</option>
                            <option value="concluido" ${chamado.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                        </select>
                        <button class="btn-action btn-responder">Responder</button>
                        <button class="btn-action btn-resolver">Resolver</button>
                    </div>
                `;
            } else {
                let statusFormatado = chamado.status ? chamado.status.toUpperCase() : 'ABERTO';
                let textStatus = chamado.status === 'andamento' ? 'EM ANDAMENTO' : statusFormatado;
                acoesHtml = `
                    <div class="chamado-actions" style="margin-top: 15px; border-top: 1px solid #F0F0F0; padding-top: 15px; width: 100%; justify-content: flex-end;">
                        <span class="status-badge status-${chamado.status}">${textStatus}</span>
                    </div>
                `;
            }

            let respostaHtml = '';
            if (chamado.respostaTecnico) {
                respostaHtml = `
                    <div style="margin-top: 15px; padding: 15px; background-color: #FFF5F0; border-radius: 8px; border-left: 4px solid #E68B5C;">
                        <p style="font-size: 10px; font-weight: 800; color: #E68B5C; margin-bottom: 5px; letter-spacing: 1px;">RESPOSTA DO TÉCNICO:</p>
                        <p style="font-size: 13px; color: #333; font-weight: 500;">${chamado.respostaTecnico}</p>
                    </div>
                `;
            }

            // O NOVO LAYOUT DO CARTÃO COM TODOS OS DADOS
            card.innerHTML = `
                <div style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="font-size: 16px; font-weight: 700; color: #2C3E50; margin: 0;">${tituloFormatado}</h3>
                        <span style="font-size: 11px; color: #A0A0A0; font-weight: 600;">${dataSegura}</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; background-color: #FAFAFA; border: 1px solid #F0F0F0; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                        <div>
                            <span style="display: block; font-size: 9px; font-weight: 800; color: #A0A0A0; letter-spacing: 1px; margin-bottom: 4px;">REQUISITANTE:</span>
                            <span style="font-size: 12px; font-weight: 600; color: #333;">${reqSeguro}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 9px; font-weight: 800; color: #A0A0A0; letter-spacing: 1px; margin-bottom: 4px;">C. DE CUSTO:</span>
                            <span style="font-size: 12px; font-weight: 600; color: #333;">${centroCustoSeguro}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 9px; font-weight: 800; color: #A0A0A0; letter-spacing: 1px; margin-bottom: 4px;">ÁREA / TÉCNICO:</span>
                            <span style="font-size: 12px; font-weight: 600; color: #333;">${tecnicoSeguro}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 9px; font-weight: 800; color: #A0A0A0; letter-spacing: 1px; margin-bottom: 4px;">URGÊNCIA:</span>
                            <span style="font-size: 12px; font-weight: 800; color: ${chamado.urgencia === 'alta' ? '#D9534F' : (chamado.urgencia === 'media' ? '#E68B5C' : '#A0A0A0')};">${urgSeguro}</span>
                        </div>
                    </div>

                    <div>
                        <span style="display: block; font-size: 9px; font-weight: 800; color: #A0A0A0; letter-spacing: 1px; margin-bottom: 6px;">DESCRIÇÃO DO PROBLEMA:</span>
                        <p style="font-size: 13px; color: #555; line-height: 1.5; margin: 0;">${descSegura}</p>
                    </div>
                </div>
                ${respostaHtml}
                ${acoesHtml}
            `;
            containerLista.appendChild(card);
        });

        aplicarCoresDosSelects();
    }

    renderizarLista();

    // ==========================================
    // 3. EVENTOS DA LISTA (AÇÕES DO TÉCNICO)
    // ==========================================
    function aplicarCoresDosSelects() {
        document.querySelectorAll('.status-select').forEach(select => {
            const valor = select.value;
            if (valor === "concluido") {
                select.style.backgroundColor = "#E8F5E9"; select.style.color = "#2E7D32"; select.style.borderColor = "#2E7D32";
            } else if (valor === "andamento") {
                select.style.backgroundColor = "#E3F2FD"; select.style.color = "#1565C0"; select.style.borderColor = "#1565C0";
            } else { 
                select.style.backgroundColor = "#FFFFFF"; select.style.color = "#333333"; select.style.borderColor = "#E0E0E0";
            }
        });
    }

    if (containerLista) {
        containerLista.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const id = e.target.closest('.chamado-actions').dataset.id;
                const novoStatus = e.target.value;
                
                const chamados = getChamados();
                const index = chamados.findIndex(c => c.id === id);
                if (index !== -1) {
                    chamados[index].status = novoStatus;
                    saveChamados(chamados);
                }
                renderizarLista(); 
            }
        });

        containerLista.addEventListener('click', (e) => {
            const actionsDiv = e.target.closest('.chamado-actions');
            if (!actionsDiv) return;
            const id = actionsDiv.dataset.id;

            if (e.target.classList.contains('btn-resolver')) {
                const chamados = getChamados();
                const index = chamados.findIndex(c => c.id === id);
                if (index !== -1) {
                    chamados[index].status = 'concluido';
                    saveChamados(chamados);
                }
                renderizarLista();
            }

            if (e.target.classList.contains('btn-responder')) {
                window.location.href = `detalhes-tecnico.html?id=${id}`;
            }
        });
    }

    // ==========================================
    // 4. ENVIO DO FORMULÁRIO (CRIAR NOVO CHAMADO)
    // ==========================================
    const formNovoChamado = document.getElementById("form-novo-chamado");
    if (formNovoChamado) {
        formNovoChamado.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const btnEnviarChamado = document.getElementById("btn-enviar-chamado");
            btnEnviarChamado.textContent = "Processando...";
            btnEnviarChamado.style.opacity = "0.8";
            btnEnviarChamado.disabled = true;

            const novoChamado = {
                id: Date.now().toString(), 
                requisitante: document.getElementById('requisitante') ? document.getElementById('requisitante').value : '',
                centroCusto: document.getElementById('centro-custo') ? document.getElementById('centro-custo').value : '',
                tipoTecnico: document.getElementById('tipo-tecnico') ? document.getElementById('tipo-tecnico').value : '',
                urgencia: document.getElementById('urgencia') ? document.getElementById('urgencia').value : '',
                local: document.getElementById('local') ? document.getElementById('local').value : '',
                tipoServico: document.getElementById('tipo-servico') ? document.getElementById('tipo-servico').value : '',
                descricao: document.getElementById('descricao') ? document.getElementById('descricao').value : '',
                status: 'aberto',
                respostaTecnico: '',
                dataCriacao: new Date().toLocaleDateString()
            };

            const chamados = getChamados();
            chamados.push(novoChamado);
            saveChamados(chamados);

            setTimeout(() => {
                alert("Chamado aberto com sucesso!");
                if (isTecnico) {
                    window.location.href = "painel-tecnico.html";
                } else {
                    window.location.href = "painel-colaborador.html";
                }
            }, 800);
        });
    }

    // ==========================================
    // 5. ATUALIZAR REQUISIÇÃO (TELA DETALHES TÉCNICO)
    // ==========================================
    const formRespostaTecnico = document.getElementById("form-resposta-tecnico");
    
    if (formRespostaTecnico) {
        const urlParams = new URLSearchParams(window.location.search);
        const chamadoId = urlParams.get('id');
        
        const chamados = getChamados();
        const chamadoAtual = chamados.find(c => c.id === chamadoId);

        if (chamadoAtual && chamadoAtual.respostaTecnico) {
            document.getElementById("resposta-tecnico").value = chamadoAtual.respostaTecnico;
            document.getElementById("novo-status").value = chamadoAtual.status;
        }

        formRespostaTecnico.addEventListener("submit", (e) => {
            e.preventDefault();

            const btnSalvarResposta = document.getElementById("btn-salvar-resposta");
            btnSalvarResposta.textContent = "Salvando...";
            btnSalvarResposta.style.opacity = "0.8";
            btnSalvarResposta.disabled = true;

            const novoStatus = document.getElementById("novo-status").value;
            const novaResposta = document.getElementById("resposta-tecnico").value;

            if (chamadoAtual) {
                chamadoAtual.status = novoStatus;
                chamadoAtual.respostaTecnico = novaResposta;
                saveChamados(chamados);
            }

            setTimeout(() => {
                alert("Requisição atualizada com sucesso!");
                window.location.href = "painel-tecnico.html";
            }, 800);
        });
    }
});

