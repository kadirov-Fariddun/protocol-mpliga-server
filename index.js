import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import md5 from 'md5';
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
// Отдельно взятый игрок PUT для трансфера
app.put('/api/players/transfer/:id', (req, res) => {
  const id = req.params.id;
  const {name, goals, yellow_cards, red_cards,age } = req.body;
  pool.query('UPDATE `players` SET `name`= ?,`goals`= ? ,`yellow_cards` = ?, `red_cards` = ?,`age` = ? WHERE `id` = ?',
    [name,goals,yellow_cards,red_cards,age,id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json({ message: `Данные для записи с id ${id} успешно обновлены`,body:{goals,yellow_cards,red_cards}});
  });
});
// Добавление нового игрока POST
app.post('/api/players/transfer', (req, res) => {
  const { name, team, goals, yellow_cards, red_cards, age } = req.body;
  pool.query(
    'INSERT INTO `players` (`name`, `team`, `goals`, `yellow_cards`, `red_cards`, `age`) VALUES (?, ?, ?, ?, ?, ?)',
    [name, team, goals, yellow_cards, red_cards, age],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
        console.error(err);
        return;
      }
      res.status(201).json({ message: 'Новый игрок успешно добавлен', playerId: result.insertId });
    }
  );
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
  pool.query('UPDATE `mpliga_table` SET `matches`= ? ,`wins` = ?, `draw` = ?,`lose` = ?, `zm` = ?, `pm` = ?, `point` = ?, WHERE `id` = ?',
    [matches, wins, draw ,lose ,zm ,pm ,point,id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json({ message: `Данные для записи с id ${id} успешно обновлены`,body:{matches, wins, draw ,lose ,zm ,pm ,point}});
  });
});


// transfer diler
app.get('/api/transfer/dilers', (req, res) => {
  pool.query('SELECT * FROM `transfer-diler`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});
// transfer join
app.get('/api/transfer/transfer-join', (req, res) => {
  pool.query('SELECT * FROM `transfer-join`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});
// transfer join POST
app.post('/api/transfer/transfer-join', (req, res) => {
  const {name,team,transfer_time,age} = req.body;
  pool.query('INSERT INTO `transfer-join` (`name`,`team`,`transfer_time`,`age`) VALUES (?,?,?,?)',[name,team,transfer_time,age], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      // Возвращаем успешный ответ с данными о вставленной записи
       res.status(201).json({
        message: 'Трансфер успешно добавлен',
        data: {name,team,transfer_time,age}
       })
  });
});
// join player DELETE
app.delete('/api/transfer/transfer-join/:id', (req, res) => {
  const id = req.params.id; // Получаем id из параметров запроса

  // Запрос к базе данных для удаления данных футболиста по id
  pool.query('DELETE FROM `transfer-join` WHERE id = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Футболист не найден' });
          return;
      }

      res.status(200).json({ message: 'Футболист успешно удален' });
  });
});



// transfer join PUT запрос
// app.put('/api/transfer/transfer-join/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, team, transfer_time, age } = req.body;

//   pool.query(
//     'UPDATE `transfer-join` SET `name` = ?, `team` = ?, `transfer_time` = ?, `age` = ? WHERE `id` = ?',
//     [name, team, transfer_time, age, id],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
//         console.error(err);
//         return;
//       }

//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: 'Трансфер не найден' });
//       } else {
//         res.status(200).json({
//           message: 'Трансфер успешно обновлен',
//           data: { id, name, team, transfer_time, age }
//         });
//       }
//     }
//   );
// });


// transfer out
app.get('/api/transfer/transfer-out', (req, res) => {
  pool.query('SELECT * FROM `transfer-out`', (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});
// transfer out
app.get('/api/transfer/transfer-out/:id', (req, res) => {
    const id = req.params.id; // Получаем id из параметров запроса
    // Запрос к базе данных для получения данных футболиста по id
    pool.query('SELECT * FROM `transfer-out` WHERE id = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }

      if (result.length === 0) {
          res.status(404).json({ message: 'Футболист не найден' });
          return;
      }

      res.json(result[0]); // Возвращаем первый элемент, так как id уникален
    });
});

// PUT запрос для обновления данных о футболисте
app.put('/api/transfer/transfer-out/:id', (req, res) => {
  const id = req.params.id; // Получаем id из параметров запроса
  const { ended } = req.body; // Получаем данные для обновления из тела запроса

  // Запрос к базе данных для обновления данных футболиста по id
  pool.query(
    'UPDATE `transfer-out` SET `ended` = ? WHERE id = ?',
    [ended, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
        console.error(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Футболист не найден' });
        return;
      }

      res.status(200).json({ message: 'Данные футболиста успешно обновлены' });
    }
  );
});
// PUT запрос для обновления данных о футболисте
app.put('/api/transfer/transfer-join/:id', (req, res) => {
  const id = req.params.id; // Получаем id из параметров запроса
  const { ended } = req.body; // Получаем данные для обновления из тела запроса

  // Запрос к базе данных для обновления данных футболиста по id
  pool.query(
    'UPDATE `transfer-join` SET `ended` = ? WHERE id = ?',
    [ended, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
        console.error(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Футболист не найден' });
        return;
      }

      res.status(200).json({ message: 'Данные футболиста успешно обновлены' });
    }
  );
});

// transfer out POST
app.post('/api/transfer/transfer-out', (req, res) => {
  const {name,team,transfer_time,age,goals,yellow_cards,red_cards} = req.body;
  pool.query('INSERT INTO `transfer-out` (`name`,`team`,`transfer_time`,`age`,`goals`,`yellow_cards`,`red_cards`) VALUES (?,?,?,?,?,?,?)',[name,team,transfer_time,age,
    goals,yellow_cards,red_cards], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      // Возвращаем успешный ответ с данными о вставленной записи
      res.status(201).json({
      message: 'Трансфер успешно добавлен',
      data: {name,team,transfer_time,age,goals,yellow_cards,red_cards}
    });
  });
});

// out player DELETE
app.delete('/api/transfer/transfer-out/:id', (req, res) => {
  const id = req.params.id; // Получаем id из параметров запроса

  // Запрос к базе данных для удаления данных футболиста по id
  pool.query('DELETE FROM `transfer-out` WHERE id = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Футболист не найден' });
          return;
      }

      res.status(200).json({ message: 'Футболист успешно удален' });
  });
});
// transfer out PUT запрос 
// app.put('/api/transfer/transfer-out/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, team, transfer_time, age, goals, yellow_cards, red_cards } = req.body;

//   pool.query(
//     'UPDATE `transfer-out` SET `name` = ?, `team` = ?, `transfer_time` = ?, `age` = ?, `goals` = ?, `yellow_cards` = ?, `red_cards` = ? WHERE `id` = ?',
//     [name, team, transfer_time, age, goals, yellow_cards, red_cards, id],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
//         console.error(err);
//         return;
//       }

//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: 'Трансфер не найден' });
//       } else {
//         res.status(200).json({
//           message: 'Трансфер успешно обновлен',
//           data: { id, name, team, transfer_time, age, goals, yellow_cards, red_cards }
//         });
//       }
//     }
//   );
// });
// only transfer diler
app.get('/api/transfer/diler/:id', (req, res) => {
  const {id} = req.params;
  pool.query('SELECT * FROM `transfer-diler` WHERE `id` = ?', [id],(err, result) => {
      if (err) {
          res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
          console.error(err);
          return;
      }
      res.json(result);
  });
});

app.listen(PORT, () => {
  console.log('Server running on PORT: ' + PORT);
});
