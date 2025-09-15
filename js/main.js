const container = document.getElementById('products-list');
const search = document.getElementById('search')
const baseUrl = 'https://68b624a5e5dc090291b0f556.mockapi.io/rsmedia/apiv1/'
container.innerHTML = '<h2>Cargando...</h2>'
try {
  const res = await fetch(`${baseUrl}products`)
  if (!res.ok) throw new Error('Error al obtener los productos')
  const data = await res.json()
  const elementos = data.length;
  let elementosMostrar = 8;
  let paginaActual = 1;
  const totalPaginas = Math.ceil(elementos / elementosMostrar);
  console.log(totalPaginas);

  function mostrarProductos() { 
    const inicio = (paginaActual - 1) * elementosMostrar;
    const fin = inicio + elementosMostrar;
    const productosAMostrar = data.slice(inicio, fin);    
    container.innerHTML = productosAMostrar.map(producto => `
      <div class="card">
        <a href="producto.html"><img src="${producto.thumbnail}" class="card-img-top" alt="${producto.name}"></a>
        <div class="card-body"></div>
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">Categoría: ${producto.category}</p>
          <p class="card-text">Marca: ${producto.brand}</p>
        </div>
      </div>    
    `).join('');
  }
  mostrarProductos();

  function crearPaginacion() {
    const paginacion = document.createElement('div');
    paginacion.classList.add('pagination');
    for (let i = 1; i <= totalPaginas; i++) {
      const boton = document.createElement('button');
      boton.textContent = i;
      if (i === paginaActual) boton.classList.add('active');    
      boton.addEventListener('click', () => {
        paginaActual = i;
        mostrarProductos(); 
        const botones = paginacion.querySelectorAll('button');
        botones.forEach(b => b.classList.remove('active'));
        boton.classList.add('active');
      });
      paginacion.appendChild(boton);
    }   
    container.parentNode.insertBefore(paginacion, container.nextSibling);
  } 
  crearPaginacion();

  search.addEventListener('input', (e) => { 
    const termino = e.target.value.toLowerCase(); 
    const productosFiltrados = data.filter(producto => 
      producto.name.toLowerCase().includes(termino) ||
      producto.category.toLowerCase().includes(termino) ||    
      producto.brand.toLowerCase().includes(termino)
    );
    container.innerHTML = productosFiltrados.map(producto => `
      <div class="card">  
        <a href="producto.html"><img src="${producto.thumbnail}" class="card-img-top" alt="${producto.name}"></a>
        <div class="card-body"></div>
          <h5 class="card-title">${producto.name}</h5>
          <p class="card-text">Categoría: ${producto.category}</p>
          <p class="card-text">Marca: ${producto.brand}</p>
        </div>
      </div>    
    `).join('');
  });

} catch (error) {
  container.innerHTML = `<h2>${error.message}</h2>`;
  console.error(error);
}   