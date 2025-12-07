-- Todos table
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO todos (title, completed) VALUES 
  ('Cloudflare Pages에 배포하기', 0),
  ('D1 데이터베이스 연동 테스트', 0),
  ('할 일 추가 기능 구현', 1);
