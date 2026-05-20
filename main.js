const dataContainer = document.getElementById("data-container")

// ─── BIENVENIDA (sessionStorage) ─────────────────────────────────────────────
// Solo se muestra una vez por sesión
if (!sessionStorage.getItem("bienvenida")) {
    alert("👋 Bienvenido al Task Manager!")
    sessionStorage.setItem("bienvenida", "true")
}

// ─── CONTADOR ────────────────────────────────────────────────────────────────
function actualizarContador() {
    const data = JSON.parse(localStorage.getItem("data")) || []
    const completadas = data.filter(item => item.state === "completed").length
    const contador = document.getElementById("contador")
    contador.textContent = "Completadas: " + completadas + " / " + data.length
}

// ─── MODO OSCURO (localStorage) ──────────────────────────────────────────────
// Se guarda en localStorage para que persista al cerrar el navegador
const btnDark = document.getElementById("btnDark")

if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark")
    btnDark.textContent = "☀️ Modo claro"
}

btnDark.addEventListener("click", function () {
    document.body.classList.toggle("dark")
    const esDark = document.body.classList.contains("dark")
    localStorage.setItem("modoOscuro", esDark)
    btnDark.textContent = esDark ? "☀️ Modo claro" : "🌙 Modo oscuro"
})

// ─── RENDER ──────────────────────────────────────────────────────────────────
function getData(container) {
    const data = JSON.parse(localStorage.getItem("data"))
    const filtroActivo = sessionStorage.getItem("filtro") || "todas"

    container.innerHTML = ""

    if (!data || data.length === 0) {
        const mensaje = document.createElement("span")
        mensaje.className = "text-center w-full col-span-4 text-gray-500"
        mensaje.textContent = "No hay tareas aún"
        container.appendChild(mensaje)
        actualizarContador()
        return
    }

    const dataFiltrada = data.filter(item => {
        if (filtroActivo === "todas") return true
        if (filtroActivo === "completadas") return item.state === "completed"
        if (filtroActivo === "pendientes") return item.state === "todo"
    })

    if (dataFiltrada.length === 0) {
        const mensaje = document.createElement("span")
        mensaje.className = "text-center w-full col-span-4 text-gray-500"
        mensaje.textContent = "No hay tareas en esta categoría"
        container.appendChild(mensaje)
        actualizarContador()
        return
    }

    dataFiltrada.forEach(item => {
        const { id, state, name, description } = item

        // ── Tarjeta
        const card = document.createElement("div")
        card.className = "col-span-1 p-3 rounded border border-stone-300 hover:shadow-lg flex flex-col gap-2"

        // ── Nombre
        const titulo = document.createElement("h3")
        titulo.className = "font-bold text-lg"
        titulo.textContent = name

        // ── Descripción
        const desc = document.createElement("p")
        desc.className = "text-sm text-gray-600 flex-grow"
        desc.textContent = description

        // ── Select de estado
        const select = document.createElement("select")
        select.className = "border border-gray-200 rounded px-2 py-1 text-sm w-full"

        const optTodo = document.createElement("option")
        optTodo.value = "todo"
        optTodo.textContent = "⏳ Pendiente"

        const optCompleted = document.createElement("option")
        optCompleted.value = "completed"
        optCompleted.textContent = "✅ Completada"

        if (state === "completed") {
            optCompleted.selected = true
            card.style.borderColor = "#86efac" // verde si está completada
        } else {
            optTodo.selected = true
        }

        select.appendChild(optTodo)
        select.appendChild(optCompleted)

        select.addEventListener("change", function () {
            updateState(id, this.value)
        })

        // ── Botones
        const btnContainer = document.createElement("div")
        btnContainer.className = "flex gap-2 mt-1"

        // Botón editar
        const btnEdit = document.createElement("button")
        btnEdit.className = "flex-1 px-3 py-1 bg-emerald-200 hover:bg-emerald-400 rounded text-sm"
        btnEdit.textContent = "✏️ Editar"
        btnEdit.addEventListener("click", function () {
            editarTarea(id)
        })

        // Botón eliminar
        const btnDelete = document.createElement("button")
        btnDelete.className = "flex-1 px-3 py-1 bg-orange-200 hover:bg-orange-400 rounded text-sm"
        btnDelete.textContent = "🗑️ Eliminar"
        btnDelete.addEventListener("click", function () {
            deleteElement(id)
        })

        btnContainer.appendChild(btnEdit)
        btnContainer.appendChild(btnDelete)

        // ── Armar tarjeta
        card.appendChild(titulo)
        card.appendChild(desc)
        card.appendChild(select)
        card.appendChild(btnContainer)

        container.appendChild(card)
    })

    actualizarContador()
}

// ─── AGREGAR ─────────────────────────────────────────────────────────────────
document.getElementById("formData").addEventListener("submit", function (event) {
    event.preventDefault()
    const data = JSON.parse(localStorage.getItem("data")) || []

    const name = document.getElementById("taskName").value.trim()
    const description = document.getElementById("description").value.trim()

    if (!name || !description) {
        alert("Por favor completa el nombre y la descripción")
        return
    }

    const task = {
        id: Date.now(),
        name: name,
        state: "todo",
        description: description
    }

    data.push(task)
    localStorage.setItem("data", JSON.stringify(data))

    this.reset()
    getData(dataContainer)
})

// ─── CAMBIAR ESTADO ───────────────────────────────────────────────────────────
function updateState(id, nuevoEstado) {
    const data = JSON.parse(localStorage.getItem("data")) || []

    const dataActualizada = data.map(item => {
        if (item.id === id) item.state = nuevoEstado
        return item
    })

    localStorage.setItem("data", JSON.stringify(dataActualizada))
    getData(dataContainer)
}

// ─── EDITAR ──────────────────────────────────────────────────────────────────
function editarTarea(id) {
    const data = JSON.parse(localStorage.getItem("data")) || []
    const tarea = data.find(item => item.id === id)

    if (!tarea) return

    // Usamos prompt para pedir los nuevos valores (sencillo y sin librerías)
    const nuevoNombre = prompt("Editar nombre:", tarea.name)
    if (nuevoNombre === null) return // canceló

    const nuevaDesc = prompt("Editar descripción:", tarea.description)
    if (nuevaDesc === null) return // canceló

    const dataActualizada = data.map(item => {
        if (item.id === id) {
            item.name = nuevoNombre.trim() || item.name
            item.description = nuevaDesc.trim() || item.description
        }
        return item
    })

    localStorage.setItem("data", JSON.stringify(dataActualizada))
    getData(dataContainer)
}

// ─── ELIMINAR ────────────────────────────────────────────────────────────────
function deleteElement(id) {
    const data = JSON.parse(localStorage.getItem("data")) || []
    const nuevaData = data.filter(item => item.id !== id)
    localStorage.setItem("data", JSON.stringify(nuevaData))
    getData(dataContainer)
}

// ─── FILTROS (sessionStorage) ─────────────────────────────────────────────────
document.querySelectorAll(".filtro").forEach(btn => {
    btn.addEventListener("click", function () {
        const filtro = this.getAttribute("data-filtro")
        // El filtro es temporal, se guarda en sessionStorage
        sessionStorage.setItem("filtro", filtro)
        getData(dataContainer)
    })
})

// ─── INICIO ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
    getData(dataContainer)
})
