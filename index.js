import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
// import PoolConfig from 'mysql/lib/PoolConfig';
const app = express();
const PORT  = process.env.PORT || 5001;


app.use(express.json());
app.use(cors());


const pool = mysql.createPool({
  host: 'protocolMpligaH',
  user: 'mpligaAdminU',
  password: 'u3wr5fxacqdv6svs',
  database: 'blpjeujegp2kxpghonbx',
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





app.listen(PORT, () => {
  console.log('Server running on PORT: ' + PORT);
});