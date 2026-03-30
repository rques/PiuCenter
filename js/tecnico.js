document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const matriculaInput = document.getElementById("matricula");
    const errorMsg = document.getElementById("error-msg");
    const submitBtn = document.getElementById("submit-btn");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const matricula = matriculaInput.value.trim();
        const matriculaValida = /^[0-9]{4,}$/.test(matricula);

        if (!matriculaValida) {
            matriculaInput.classList.add("input-error");
            errorMsg.style.display = "block";
            matriculaInput.focus();
        } else {
            matriculaInput.classList.remove("input-error");
            errorMsg.style.display = "none";

            submitBtn.textContent = "Validando...";
            submitBtn.style.opacity = "0.8";
            submitBtn.disabled = true;

            // Salva os dados na sessão para o Técnico
            sessionStorage.setItem("tecnicoLogado", "true");
            sessionStorage.setItem("matriculaTecnico", matricula);

            setTimeout(() => {
                // Redireciona para o painel principal do técnico
                window.location.href = "painel-tecnico.html"; 
            }, 1000);
        }
    });

    matriculaInput.addEventListener("input", () => {
        if (matriculaInput.classList.contains("input-error")) {
            matriculaInput.classList.remove("input-error");
            errorMsg.style.display = "none";
        }
    });
});