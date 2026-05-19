const dataContainer = document.getElementById("data-container")

function getData(container) {
    const data = JSON.parse(localStorage.getItem("data"))
    if (!data) {
        container.innerHTML += `<span class="text-center w-full col-span-4">No hay data</span>`
        return
    }
    const total = data.map(item=>{
        const {id,state, name, description} = item
        return ` <div class="col-span-1 p-2 rounded border border-stone-300 hover:shadow-gray-200 hover:shadow-lg flex flex-col items-center">
            <h3 class="font-bold text-xl">
                ${name}
            </h3>
            <span class="opacity-50">${state}</span>
            <p class="text-justify">${description}</p>

            <div class="grid grid-cols-2 gap-3">
                <button data-id="${id}" class="edit px-3 py-1 bg-emerald-200 hover:bg-emerald-400 rounded" id="addBtn">Edit</button>
                <button data-id="${id}" class="delete px-3 py-1 bg-orange-200 hover:bg-orange-400 rounded" id="addBtn">Delete</button>
            </div>
        </div>`
    }).join("")
    document.querySelectorAll(".delete").addEventListener("click", deleteElement("data-id"))

    container.innerHTML = total
}

document.getElementById("formData").addEventListener("submit", function(event){
    const data = JSON.parse(localStorage.getItem("data")) || []
    event.preventDefault()
    const name = document.getElementById("taskName").value
    const state = document.getElementById("state").value
    const description = document.getElementById("description").value

    const task = {
        id: data.length+1,
        name: name,
        state: state,
        description: description 
    }
    data.push(task)

    localStorage.setItem("data", JSON.stringify(data))
    getData(dataContainer)
})

function deleteElement(id){
    console.log(id)
}

document.addEventListener("DOMContentLoaded", function () {
    getData(dataContainer)
})