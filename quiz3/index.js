// utiltities
const nanoid = import('nanoid');
const fs = require('fs');

function input(message) {

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve, reject) => {

    try {
      
      readline.question(message, result => {
        
        resolve(result.trim());
        readline.close();

      });

    } catch (error) {
      reject(error);
    }
  })
}

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (!err) resolve(JSON.parse(data));  
      else reject(err);
    })
  })
}

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if(!err) resolve('Succesfully insert data');
      else reject(err)
    })
  })
}

const removeFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.rm(path, function (err) {
      if (!err) resolve(true)
      else reject(err)
    });
  });
}



// write data todo nanti disini
const writeData = async (id = null, todoMessage, status = false) => {
  try {

    id = !id ? (await nanoid).nanoid() : id;

    const todoPath = './todos.json';
    const todos = await readFile(todoPath);
    const newData = [...todos, { id, todo: todoMessage, status }]
    const message = await writeFile(todoPath, newData) ;

    console.log(message)

    const dataUpdated = await readFile(todoPath);
    console.log('data updated last', dataUpdated);
    
  } catch(e) {

    console.log('error', e);
  }  
}



const readOneFile = async (id = null) => {
  try {

    if (!id) console.error('id not provided!');

    const todoPath = './todos.json';
    const data = await readFile(todoPath);
    
    console.log('todos', data);
    // console.log(Array.from(data).includes({ todoMessage }) ? `todo ${todoMessage} found!` : `todo ${todoMessage} not found!`)
    
    for (const todo of data) {

      if(todo.id === id)  {
        console.log('todos found!');
        console.log('todoMessage', todo.todo);
        console.log('status', todo.status);
        break;
      }
    }
  } catch(err) {
  }
}


const readAllFile = async () => {
  // logic here to get all file
  const todoPath = './todos.json';
  const data = await readFile(todoPath);
  for (const todo of data) {

    console.log('id', todo.id);
    console.log('todoMessage', todo.todo);
    console.log('status', todo.status ? 'active' : 'deactive');
  }
}


const updateFile = async (id, todoMessage, status = false) => {
  // / logic here for udpate one data
  const todoPath = './todos.json';

  let data = await readFile(todoPath);

  const check = Array.from(data).filter(o => o.id === id).length > 0;

  if (!check) {
    console.log('todo tidek ditemukan!')
    return
  }

  data = data.map(o => {

    if (!status) status = o.status;
    if (o.id === id) return { id: o.id, todo: todoMessage, status,}
    return o
  })

  const message = await writeFile(todoPath, data);

  console.log('todo sudah di update, mungkin saya tidak menjamin');
  console.log(message);
}

const writeNewData = async (data = []) => {

  const todoPath = './todos.json';
  const message = await writeFile(todoPath, data);

  console.log(message);
}

const deleteOneData = async (id) => {
  // / logic here for udpate one data
  const todoPath = './todos.json';

  const data = await readFile(todoPath);

  const check = Array.from(data).filter(o => o.id === id).length > 0;

  if (!check) {
    console.log('todo tidek ditemukan!')
    return
  }

  let deleted = false;

  while (true) {

    let count = 0;
    let index = -1;

    for (const todo of data) {

      if (todo.id === id) {

        index = count;
        break;
      }
      count++;
    }

    if (index > -1) {

      data.splice(index, 1);
      deleted = true;
    }
    else break;
  }

  const message = await writeFile(todoPath, data);

  if (deleted) console.log('data todo sudah di delete');
  console.log(message);
}

const deleteData = async () => {
  
  const todoPath = './todos.json';
  const status = removeFile(todoPath);
  if (status) console.log('file has been removed!');
}

async function clearPrompt() {

  await input('press any key to continue: ');
  console.clear();
}

async function init() {

	const todoPath = './todos.json';
	
  // writeData
  // readOneFile
  // readAllFile
  // updateFile
  // writeNewData
  // deleteOneData
  // deleteData

  let terminate = false;
  while (true) {

    if (!fs.existsSync(todoPath)) {

      const prm = await input('kamu mau membuat file todos.json ? ketik [Y/n]: ');
    
      if (prm.toLowerCase() === 'y') await writeNewData();
      else {

        console.log('karena todos.json tidak ada, maka aplikasi ini tidak bisa dilanjutkan, mohon maaf!');
        break;
      }
    }

    console.log('1. tambah todo')
    console.log('2. cari todo')
    console.log('3. lihat keseluruhan')
    console.log('4. perbarui todo')
    console.log('5. bikin todo baru')
    console.log('6. hapus todo')
    console.log('7. hapus semua todo')
    console.log('8. exit')

    const xin = await input('memilih nomer: ');

    console.clear();

    switch (xin.trim()) {

      case '1':

        await writeData(null, await input('silahkan masukan todo pesan: '), (await input('status [1/0]: ')) === '1' ? true : false);
        break;

      case '2':

        await readOneFile(await input('silahkan masukan id todo: '));
        break;

      case '3':

        await readAllFile();
        break;

      case '4':

        await updateFile(await input('silahkan masukan id: '), await input('silahkan masukan todo pesan: '), (await input('status [1/0]: ')) === '1' ? true : false);
        break;

      case '5':

        await writeNewData();
        break;

      case '6':

        await deleteOneData(await input('silahkan masukan id todo: '));
        break;

      case '7':

        await deleteData();
        break;

      case '8':
        
        terminate = true;
        break;
    
      default:
        
        console.log('pilihan tidak ada, silahkan coba lagi!');
        break;
    }

    if (terminate) break;

    await clearPrompt();
  }
}

init();

// nanoid.then((nn) => {

//   const id = nn.nanoid(); // generated random id
//   writeData(id, 'hari ini cuaca nya cerah', true).then(async () => {

//     console.log('nambah data');

//     // procedure
//     await readOneFile(id);

//     await readAllFile();

//     await updateFile(id, 'hari ini cuaca nya hujan', false);

//     await deleteOneData(id);
//     // await deleteData();
//   });
// });
