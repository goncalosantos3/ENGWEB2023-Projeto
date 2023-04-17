module Ficha1 where

import Data.Char 

perimetro :: Float -> Float
perimetro raio = 2 * pi * raio

dist :: (Double, Double) -> (Double,Double) -> Double
dist (x1,y1) (x2,y2) = sqrt ( (x1-x2)^2 + (y2-y1)^2) 


distB p1 p2 = sqrt ( (fst p1 - fst p2)^2 + 
                     (snd p1 - snd p2)^2  )

primUlt :: [a] -> (a, a)
primUlt l = ( head l  , last l )


multiplo m n = mod m n == 0

truncaImpar l = if mod (length l) 2 == 0 then l
                else tail l

truncaImparB l | mod (length l) 2 == 0 = l
               | otherwise             = tail l


max2 :: Int -> Int -> Int
max2 n1 n2 = if n1 > n2 then n1 else n2

max3 :: Int -> Int -> Int -> Int
max3 a b c = if a > b then 
                  if a > c then a
                  else c
             else if b > c then b
                  else c

max3B a b c = max2 (max2 a b) c


type Hora = (Int,Int)

testaHora :: Hora -> Bool
testaHora (h,m) = (h >= 0) && (h < 24) &&    
                  (m >= 0) && (m < 60)

-- dá verdade se a 1a é maior do que a 2a

comparaHora :: Hora -> Hora -> Bool
comparaHora (h1,m1) (h2,m2) | h1 > h2   = True
                            | h1 < h2   = False
                            | m1 > m2   = True
                            | otherwise = False

horasParaMinutos :: Hora -> Int
horasParaMinutos (h,m) = h * 60 + m

minutosParaHoras :: Int -> Hora
minutosParaHoras m = ( div m 60, mod m 60)


diferencaHoras :: Hora -> Hora -> Int
diferencaHoras (h1,m1) (h2,m2) = if h1 == h2 then abs (m1 -m2)
                                 else abs ((h1-h2) * 60) + abs (m1 -m2)

diferencaHorasB h1 h2 = abs ((horasParaMinutos h1) - (horasParaMinutos h2))
-- difenca de  horas e diferenca de horas B são iguais a diferença é que a difenca de horas B pode dar numeros negativos

adicionaMinutos :: Hora -> Int -> Hora
adicionaMinutos h m = minutosParaHoras ((horasParaMinutos h) + m)



--
-- Exercício 4
--

data HoraN = H Int Int
          deriving (Show,Eq)

h1 = H 0 15

testaHoraN :: HoraN -> Bool
testaHoraN (H h m) = testaHora (h,m)

minutosParaHorasN :: Int -> HoraN
minutosParaHorasN m =  H (div m 60) (mod m 60)


--
--Exercicio 5


data Semaforo = Verde
              |Amarelo
              |Vermelho
              deriving (Show,Eq)
 
s1 = Verde
s2 = Vermelho

next :: Semaforo -> Semaforo
next Verde    = Amarelo
next Amarelo  = Vermelho
next Vermelho = Verde

stop :: Semaforo -> Bool
stop Amarelo  = True
stop Vermelho = True
stop Verde    = False

stop' Verde = False
stop' _     = True

-- O underscore "_" são os outros casos.

safe :: Semaforo -> Semaforo -> Bool
safe Vermelho _ = True
safe _ Vermelho = True
safe _ _        = False 

-- Neste caso o underscore "_" representa cada um dos 2 semaforos


--
-- Exercicio 8
--

isLower' :: Char -> Bool
isLower' c= (ord c) >= 97 && (ord c) <=  122

-- A pelica "'" serve para díferenciar a função que já existe nesta Biblioteca da função que estamos a recriar agora.

isDigit' :: Char -> Bool
isDigit' c = (ord c) >= (ord '0') && (ord c) <= (ord '9')


-- Para fazer o toUpper temos que subtrair ao número da minuscula 32 para dar o numero da maiuscula 






