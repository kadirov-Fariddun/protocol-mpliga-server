import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import md5 from 'md'
import bcrypt from 'bcryptjs';
// import PoolConfig from 'mysql/lib/PoolConfig';
const app = express();
const PORT  = process.env.PORT || 5001;


app.use(express.json());
app.use(cors());


const pool = mysql.createPool({
  host: '45.84.225.47',
  user: 'root',
  password: 'kadiropmProt1',
  database: 'protocol-mpliga',
  connectionLimit: 10
});



// все команды
app.get('/api/teams/', (req, res) => {
  pool.query('SELECT * FROM `teams`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

// Отдельно взятая команда 
app.get('/api/teams/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM `teams` WHERE `id` = ?',[id] ,(err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

// Отдельно взятая команда PUT
app.put('/api/teams/:id', (req, res) => {
  const id = req.params.id;
  const { date,ended,goals,point,red_card,yellow_card } = req.body;
  pool.query('UPDATE `teams` SET `date`= ? ,`ended` = ? ,`goals` = ?, `point` = ? ,`red_card` = ?,`yellow_card` = ? WHERE `id` = ?',
    [date,ended,goals,point,red_card,yellow_card,id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json({ message: `Данные для записи с id ${id} успешно обновлены`,body:{date,goals,red_card,yellow_card}});
  });
});




// Все игроки
app.get('/api/players/', (req, res) => {
  pool.query('SELECT * FROM `players`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

// Отдельно взятый игрок
app.get('/api/players/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM `players` WHERE `id` = '+id+'', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

// Отдельно взятый игрок PUT
app.put('/api/players/:id', (req, res) => {
  const id = req.params.id;
  const { goals, yellow_cards, red_cards } = req.body;
  pool.query('UPDATE `players` SET `goals`= ? ,`yellow_cards` = ?, `red_cards` = ? WHERE `id` = ?',
    [goals,yellow_cards,red_cards,id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json({ message: `Данные для записи с id ${id} успешно обновлены`,body:{goals,yellow_cards,red_cards}});
  });
});


// все команды
app.get('/api/user/', (req, res) => {
  pool.query('SELECT * FROM `user`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});
// возврашем таблицу лиги
app.get('/api/table/', (req, res) => {
  pool.query('SELECT * FROM `mpliga_table` ORDER BY `point` DESC', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

// Отдельно взятая команда в таблице
app.put('/api/table/:id', (req, res) => {
  const id = req.params.id;
  const { matches, wins, draw ,lose ,zm ,pm ,point} = req.body;
  pool.query('UPDATE `mpliga_table` SET `matches`= ? ,`wins` = ?, `draw` = ?,`lose` = ?, `zm` = ?, `pm` = ?, `point` = ? WHERE `id` = ?',
    [matches, wins, draw ,lose ,zm ,pm ,point,id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json({ message: `Данные для записи с id ${id} успешно обновлены`,body:{matches, wins, draw ,lose ,zm ,pm ,point}});
  });
});




// GET запрос для регистрации в кубке mpliga
app.get('/api/kubok-register/',(req,res)=>{
  pool.query('SELECT * FROM `kubok-register`',(err,result) => {
    if(err){
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }
    res.json(result)
  })
});
// GET запрос для регистрации в кубке mpliga получаем отдельного пользователя
app.get('/api/kubok-register/:id',(req,res)=>{
  const {id} = req.params;
  pool.query('SELECT * FROM `kubok-register` WHERE `id` = ?',[id],(err,result) => {
    if(err){
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }
    res.json(result)
  });
});
// GET запрос для регистрации в кубке mpliga получаем отдельного пользователя по ИМЕНИ команды
app.get('/api/kubok-register/:team_name',(req,res)=>{
  const {team_name} = req.params;
  pool.query('SELECT * FROM `kubok-register` WHERE `team_name` = ?',[team_name],(err,result) => {
    if(err){
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }
    res.json(result);
  });
});

// GET запрос получаем всех игроков которые зарегистрировались 
app.get('/api/kubok-players/',(req,res)=>{
  pool.query('SELECT * FROM `kubok-players`',(err,result) => {
    if(err){
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }
    res.json(result)
  })
});
// GET запрос получаем отдельно взятого игрока 
app.get('/api/kubok-players/players/:id',(req,res)=>{
  const {id} = req.params;
  pool.query('SELECT * FROM `kubok-players` WHERE `id` = ?',[id],(err,result) => {
    if(err){
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }
    res.json(result);
  });
});

// DELETE запрос для удаления игрока
app.delete('/api/kubok-players/players/:id', (req, res) => {
  const { id } = req.params;
  
  // Запрос на удаление игрока из базы данных
  pool.query('DELETE FROM `kubok-players` WHERE `id` = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка при удалении игрока из базы данных' });
      console.error(err);
      return;
    }
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Игрок не найден' });
      return;
    }

    res.json({ message: 'Игрок успешно удалён' });
  });
});

// GET запрос получаем отдельно взятого игрока по имени команды
app.get('/api/kubok-players/:team_name', (req, res) => {
  const { team_name } = req.params;

  // SQL запрос для получения всех игроков с указанным team_name
  pool.query('SELECT * FROM `kubok-players` WHERE `team_name` = ?', [team_name], (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса к базе данных:', err);
      return res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
    }

    // Если не найдено ни одной записи
    if (result.length === 0) {
      return res.status(404).json({ error: 'Игроки с указанной командой не найдены' });
    }

    // Возвращаем массив найденных объектов
    res.json(result);
  });
});

// POST запрос для таблицы kubok-register создаем пользователя
app.post('/api/kubok-register/', (req, res) => {
  const { name, password, team_name, phone_number } = req.body; // Получаем данные из тела запроса

  // Проверка, что все необходимые поля переданы
  if (!name || !password || !team_name || !phone_number) {
    return res.status(400).json({ error: 'Все поля (name, password, team_name, phone_number) обязательны' });
  }

  // Хеширование пароля перед сохранением
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка хеширования пароля' });
    }

    // SQL запрос для вставки нового пользователя в таблицу с хешированным паролем
    const sql = 'INSERT INTO `kubok-register` (name, password, team_name, phone_number) VALUES (?, ?, ?, ?)';

    // Выполняем запрос к базе данных
    pool.query(sql, [name, hashedPassword, team_name, phone_number], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
        console.error(err);
        return;
      }

      // Возвращаем успех и информацию о новом пользователе
      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        userId: result.insertId, // ID нового пользователя, добавленного в базу данных
      });
    });
  });
});


// POST запрос для таблицы kubok-players создаем пользователя
app.post('/api/kubok-players/', (req, res) => {
  const { firstname, lastname, age, photo_url, team_name } = req.body; // Получаем данные из тела запроса

  // Проверка, что все необходимые поля переданы
  if (!firstname || !lastname || !age || !photo_url || !team_name) {
    return res.status(400).json({ error: 'Все поля (firstname, lastname, age, photo_url, team_name) обязательны' });
  }

  // SQL запрос для вставки нового пользователя в таблицу
  const sql = 'INSERT INTO `kubok-players` (firstname, lastname, age, photo_url, team_name) VALUES (?, ?, ?, ?, ?)';

  // Выполняем запрос к базе данных
  pool.query(sql, [firstname, lastname, age, photo_url, team_name], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
      console.error(err);
      return;
    }

    // Возвращаем успех и информацию о новом пользователе
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      userId: result.insertId, // ID нового пользователя, добавленного в базу данных
    });
  });
});




// создаем API для авторизации пользователя 
// проверка подленности пароля 
const checkPassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};

// API для авторизации пользователя
app.post('/api/kubok-register/login', async (req, res) => {
  const { name, team_name, password } = req.body;

    pool.query('SELECT * FROM `kubok-register` WHERE name = ? && team_name = ?',[name, team_name],async (err,result)=>{
      console.log('Полученные пользователи:', result); // Логируем массив пользователей

      // Если пользователь не найден
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }
      const user = result[0]; // Предполагаем, что мы нашли только одного пользователя

      console.log('Найденный пользователь:', user); // Логируем найденного пользователя

       // Проверяем поля объекта user
      console.log('Поля пользователя:', Object.keys(user)); // Логируем ключи объекта user

      // Проверяем пароль
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (isPasswordCorrect) {
        return res.status(200).json(user);
      } else {
        return res.status(401).send('Incorrect password');
      }
      
    });
   
});


app.listen(PORT, () => {
  console.log('Server running on PORT: ' + PORT);
});
