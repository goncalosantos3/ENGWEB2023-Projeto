
public class Ficha1{
    public double celsiusParaFarenheit(double graus){//Exercício 1
        double Farenheit = graus*1.8+32; 
        return Farenheit;
    }
    public int maximoNumeros(int a, int b){//Exercício 2
        if(a>b) return a;
        return b;
    }
    public double eurosParaLibras(double valor, double taxaConversao){//Exercício 4
        double libras = valor*taxaConversao;
        return libras;
    }
    public long factorial(int num){
        long result=num--;
        
        while(num>0){
            result*=num;
            num--;
        }
        return result;
    }
}