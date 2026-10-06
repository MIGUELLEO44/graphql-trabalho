const GRAPHQL_ENDPOINT = "https://testing-graphql.onrender.com/graphql";


async function consultarGraphQL(query) {

    const resposta = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query: query
        })
    });

    const resultado = await resposta.json();

    if (resultado.errors) {
        throw new Error(resultado.errors[0].message);
    }

    return resultado.data;
}


// ==============================
// ALUNOS
// ==============================

const QUERY_ALUNOS = `
    query {
        students {
            id
            name
            email
            course {
                id
                name
                credits
            }
        }
    }
`;


async function carregarAlunos() {

    const container = document.getElementById("alunos");

    container.innerHTML = `
        <p class="carregando">Carregando...</p>
    `;

    try {

        const dados = await consultarGraphQL(QUERY_ALUNOS);

        container.innerHTML = "";

        dados.students.forEach(aluno => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <strong>Nome:</strong> ${aluno.name}<br>
                <strong>E-mail:</strong> ${aluno.email}<br>
                <strong>Curso:</strong> 
                ${aluno.course ? aluno.course.name : "Não informado"}
            `;

            container.appendChild(card);
        });

    } catch (erro) {

        container.innerHTML = `
            <p class="erro">
                Erro ao carregar alunos: ${erro.message}
            </p>
        `;
    }
}


// ==============================
// CURSOS
// ==============================

const QUERY_CURSOS = `
    query {
        courses {
            id
            name
            credits
            students {
                id
                name
            }
        }
    }
`;


async function carregarCursos() {

    const container = document.getElementById("cursos");

    container.innerHTML = `
        <p class="carregando">Carregando...</p>
    `;

    try {

        const dados = await consultarGraphQL(QUERY_CURSOS);

        container.innerHTML = "";

        dados.courses.forEach(curso => {

            const card = document.createElement("div");

            card.className = "card";

            let alunos = "";

            if (curso.students.length > 0) {

                alunos = curso.students
                    .map(aluno => aluno.name)
                    .join(", ");

            } else {

                alunos = "Nenhum aluno";
            }

            card.innerHTML = `
                <strong>Curso:</strong> ${curso.name}<br>
                <strong>Créditos:</strong> ${curso.credits}<br>
                <strong>Alunos:</strong> ${alunos}
            `;

            container.appendChild(card);
        });

    } catch (erro) {

        container.innerHTML = `
            <p class="erro">
                Erro ao carregar cursos: ${erro.message}
            </p>
        `;
    }
}


// ==============================
// PROFESSORES
// ==============================

const QUERY_PROFESSORES = `
    query {
        teachers {
            id
            name
            courses {
                id
                name
            }
        }
    }
`;


async function carregarProfessores() {

    const container = document.getElementById("professores");

    container.innerHTML = `
        <p class="carregando">Carregando...</p>
    `;

    try {

        const dados = await consultarGraphQL(QUERY_PROFESSORES);

        container.innerHTML = "";

        dados.teachers.forEach(professor => {

            const card = document.createElement("div");

            card.className = "card";

            let cursos = "";

            if (professor.courses.length > 0) {

                cursos = professor.courses
                    .map(curso => curso.name)
                    .join(", ");

            } else {

                cursos = "Nenhum curso";
            }

            card.innerHTML = `
                <strong>Professor:</strong> ${professor.name}<br>
                <strong>Cursos:</strong> ${cursos}
            `;

            container.appendChild(card);
        });

    } catch (erro) {

        container.innerHTML = `
            <p class="erro">
                Erro ao carregar professores: ${erro.message}
            </p>
        `;
    }
}


// ==============================
// BOTÕES
// ==============================

document
    .getElementById("btnAlunos")
    .addEventListener("click", carregarAlunos);

document
    .getElementById("btnCursos")
    .addEventListener("click", carregarCursos);

document
    .getElementById("btnProfessores")
    .addEventListener("click", carregarProfessores);