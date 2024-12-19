async function obtenerDatos() {
    try {
        const respuesta = await fetch('http://192.168.1.83/Wemos/modelo/obtener_datos.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        console.log('Datos recibidos:', datos); // Mensaje de depuración
        return datos;
    } catch (error) {
        console.error('Error al obtener datos:', error); // Imprimir errores de solicitud
    }
}

async function actualizarGrafica(grafica, etiquetas, valoresPotenciometro, valoresSensorInfra, valoresSensorProx) {
    const datos = await obtenerDatos();
    const nuevasEtiquetas = datos.map(d => new Date(d.fecha));
    const nuevosValoresPotenciometro = datos.map(d => d.Potenciometro);
    const nuevosValoresSensorInfra = datos.map(d => d.SensorInfra);
    const nuevosValoresSensorProx = datos.map(d => d.SensorProx);

    etiquetas.length = 0; // Limpiar el array de etiquetas
    valoresPotenciometro.length = 0; // Limpiar el array de valores del potenciómetro
    valoresSensorInfra.length = 0; // Limpiar el array de valores del sensor infrarrojo
    valoresSensorProx.length = 0; // Limpiar el array de valores del sensor PIR

    etiquetas.push(...nuevasEtiquetas); // Agregar nuevas etiquetas
    valoresPotenciometro.push(...nuevosValoresPotenciometro); // Agregar nuevos valores del potenciómetro
    valoresSensorInfra.push(...nuevosValoresSensorInfra); // Agregar nuevos valores del sensor infrarrojo
    valoresSensorProx.push(...nuevosValoresSensorProx); // Agregar nuevos valores del sensor PIR

    grafica.update(); // Actualizar la gráfica
}

async function crearGraficaLineas() {
    const datos = await obtenerDatos();
    const etiquetas = datos.map(d => new Date(d.fecha));
    const valoresPotenciometro = datos.map(d => d.Potenciometro);
    const valoresSensorInfra = datos.map(d => d.SensorInfra);
    const valoresSensorProx = datos.map(d => d.SensorProx);

    const ctx = document.getElementById('graficaLineas').getContext('2d');
    const grafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Valores Potenciómetro',
                    data: valoresPotenciometro,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Valores Sensor Infra',
                    data: valoresSensorInfra,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Valores Sensor Prox',
                    data: valoresSensorProx,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'dd/MM/yyyy HH:mm',
                        displayFormats: {
                            minute: 'dd/MM/yyyy HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha y Hora'
                    },
                    ticks: {
                        source: 'auto',
                        major: {
                            enabled: true
                        },
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    setInterval(() => actualizarGrafica(grafica, etiquetas, valoresPotenciometro, valoresSensorInfra, valoresSensorProx), 2000); // Actualizar cada 2 segundos
}

crearGraficaLineas();