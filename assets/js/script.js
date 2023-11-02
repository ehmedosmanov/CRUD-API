const baseUrl = 'https://northwind.vercel.app/api/products'
const dataTable = document.getElementById('data-table')
const createBtn = document.getElementById('create')
const updateBtn = document.getElementById('update')
const nameInput = document.getElementById('nameInput')
const priceInput = document.getElementById('priceInput')
const reorderLevelInput = document.getElementById('reorderLevelInput')

//Get
async function fetchData() {
  try {
    const response = await axios(baseUrl)
    const data = response.data
    addTable(data)
  } catch (error) {
    console.log('Error:', error)
  }
}

function addTable(data) {
  data.forEach(element => {
    let tableRow = document.createElement('tr')
    tableRow.innerHTML += `
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td>${element.unitPrice}</td>
        <td>${element.reorderLevel}</td>
        `
    const actionsBox = document.createElement('td')
    actionsBox.classList.add('actions')
    const editBtn = document.createElement('button')
    const deleteBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    deleteBtn.textContent = 'Delete'
    deleteBtn.classList.add('delete')
    editBtn.classList.add('edit')
    editBtn.addEventListener('click', () => editPost(element.id))
    deleteBtn.addEventListener('click', () => deletePost(element.id))

    actionsBox.append(editBtn, deleteBtn)
    tableRow.append(actionsBox)
    dataTable.append(tableRow)
  })
}

//Create
createBtn.addEventListener('click', async e => {
  e.preventDefault()
  async function createPost() {
    try {
      await axios.post(baseUrl, {
        unitPrice: priceInput.value,
        reorderLevel: reorderLevelInput.value,
        name: nameInput.value
      })
      await fetchData()
      nameInput.value = ''
      priceInput.value = ''
      reorderLevelInput.value = ''
    } catch (error) {
      console.log('Error:', error)
    }
  }
  dataTable.innerHTML = ''
  await createPost()
})

//Delete
async function deletePost(postId) {
  try {
    await axios.delete(`${baseUrl}/${postId}`)
    dataTable.innerHTML = ''
    await fetchData()
  } catch (error) {
    console.log('Error:', error)
  }
}

let editPostId = null
//Update
async function editPost(editId) {
  try {
    const response = await axios.get(`${baseUrl}/${editId}`)
    const data = response.data
    nameInput.value = data.name
    priceInput.value = data.unitPrice
    reorderLevelInput.value = data.reorderLevel
    console.log(reorderLevelInput.value)
    editPostId = editId
  } catch (error) {
    console.log('Error:', error)
  }
}

updateBtn.addEventListener('click', async e => {
  e.preventDefault()
  async function updatePost() {
    if (editPostId) {
      try {
        await axios.put(`${baseUrl}/${editPostId}`, {
          unitPrice: priceInput.value,
          reorderLevel: reorderLevelInput.value,
          name: nameInput.value
        })
        await fetchData()
      } catch (error) {
        console.log(error)
      }
    }
  }
  dataTable.innerHTML = ''
  await updatePost()
})

fetchData()
