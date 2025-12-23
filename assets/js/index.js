const senhaInput = document.getElementById("senha");
const loginBox = document.getElementById("loginBox");
const painel = document.getElementById("painel");
const loadingOverlay = document.getElementById("loadingOverlay"); 

    // *** MUITO IMPORTANTE: SUBSTITUA PELA URL DO SEU APPS SCRIPT WEB APP ***
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSY24m-WDFeqaavZCOKuVfopmnA8aOjSPHymGOxnp8j6MBpD549berSCEkUY7RgQ4u/exec"; 

    /**
     * Envia o título da aba clicada (type: vote)
     */
    async function registrarSelecao(titulo) {
        loadingOverlay.style.display = 'flex'; 

        const dados = {
            tipo: "vote", // Identifica como requisição de voto
            titulo: titulo,
            data: new Date().toLocaleString('pt-BR') 
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', 
                body: JSON.stringify(dados)
            });
            
            console.log(`Voto "${titulo}" enviado.`);
            alert(`Você selecionou: ${titulo}. Voto computado!`);

        } catch (error) {
            console.error('Erro ao registrar o voto:', error);
            alert(`Erro ao registrar o voto (${titulo}).`);
        } finally {
            loadingOverlay.style.display = 'none'; 
        }
    }

    /**
     * Verifica a senha digitada no Apps Script (type: login)
     */
    async function verificarLogin(senha) {
        loadingOverlay.style.display = 'flex'; 

        const dados = {
            tipo: "login", // Identifica como requisição de login
            senha: senha
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                // Usando 'cors' para tentar ler a resposta do GAS (necessário para .json())
                mode: 'cors', 
                body: JSON.stringify(dados)
            });

            // O Google Apps Script deve retornar a resposta JSON
            const resultado = await response.json();
            
            return resultado.login === true; // Retorna true ou false
        
        } catch (error) {
            console.error('Erro ao verificar login (API/Rede):', error);
            // Em caso de erro, tratamos como falha de login por segurança
            return false;
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }


    /**
     * Configura os event listeners para o painel de abas após o login
     */
    function configurarAbas() {
        const abas = document.querySelectorAll('.aba');
        abas.forEach(aba => {
            aba.addEventListener('click', () => {
                const tituloElement = aba.querySelector('h2');
                if (tituloElement) {
                    const titulo = tituloElement.textContent.trim();
                    registrarSelecao(titulo);
                }
            });
        });
    }

    
    // Listener principal para o evento de login
    senhaInput.addEventListener("keydown", async function(e) {
        if (e.key === "Enter") {
            const senhaDigitada = senhaInput.value;
            const loginSucesso = await verificarLogin(senhaDigitada); 

            if (loginSucesso) {
                loginBox.style.display = "none";
                painel.style.display = "block";
                
                // Configura os listeners das abas apenas após o login
                configurarAbas(); 
            } else {
                senhaInput.style.borderColor = "red";
                senhaInput.value = "";
                alert("Senha Incorreta!");
            }
        }
    });