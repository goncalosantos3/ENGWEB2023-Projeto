#include <stdlib.h>
#include <stdio.h>

//////////////////////////////////////////////////////////////// PARTE A //////////////////////////////////////////////////////////////////////////////

typedef struct slist {
   int valor;
   struct slist *prox;
} *LInt;

typedef struct nodo {
   int valor;
   struct nodo *esq, *dir;
} *ABin;

int tam (char s[]){//Devolve o tamanho de uma string
   int i;

   for(i=0;s[i];i++);
   return i;
}

void swap (char *c1, char *c2){//Troca o contéudo de dois apontadores de caracter
   char c=*c1;

   *c1=*c2;
   *c2=c;
}

void strrev (char s[]){//Que inverte uma string
   int i,comp=tam(s),meio;
   meio=comp/2;

   for(i=0;i<meio;i++){
       swap(s+i,s+comp-i-1);
   }
}

int remRep (char x[]){//Que retira todos os caracteres de uma string que se repetem sucessivamente deixando lá apenas uma cópia
   int i,j=0;
   char aux[tam(x)];

   aux[0]=x[0];
   for(i=1;x[i];i++){
       if(aux[j]!=x[i]){
           j++;
           aux[j]=x[i];
       }
   }
   aux[j+1]='\0';
   for(i=0;aux[i];i++){
       x[i]=aux[i];
   }
   x[i]='\0';
   return i;
}

void merge (int r[], int a[], int b[], int na, int nb){//Que, dados vetores ordenados a (com na elementos) e b (com nb elementos), preenche o vetor v (com na+nb elementos) com os elementos de a e b ordenados.
   int i,ia=0,ib=0,h;
   
   for(i=0;ia<na && ib<nb;i++){
       if(a[ia]<=b[ib]){
           r[i]=a[ia];
           ia++;
       }else{
           r[i]=b[ib];
           ib++;
       }
   }
   if(ia<na){
       while(ia<na){
           r[i++]=a[ia++];
       }
   }else{
       while(ib<nb){
           r[i++]=b[ib++];
       }
   }
}

int nodos (ABin a){//Devolve o número de nodos de uma árvore
   int r=0;
   
   if(a!=NULL){
       r=1+nodos(a->esq)+nodos(a->dir);
   }
   return r;
}

int deDeProcura (ABin a){//Que testa se uma árvore é de procura
   int r=0;

   if(a!=NULL){
       if(a->dir!=NULL && a->esq!=NULL){
           if(a->valor<a->esq->valor || a->valor>a->dir->valor){
               r=0;
           }else{
               r=1+deDeProcura(a->esq)+deDeProcura(a->dir);
           }
       }else{
           if(a->dir!=NULL){
               if(a->dir->valor<a->valor){
                   r=0;
               }else{
                   r=1+deDeProcura(a->dir);
               }
           }else{
               if(a->esq!=NULL){
                   if(a->esq->valor>a->valor){
                       r=0;
                   }else{
                       r=1+deDeProcura(a->esq);
                   }
               }else{
                   if(a->esq==NULL && a->dir==NULL){
                       r=1;
                   }
               }
           }
       }
   }
   return r;
}

int deProcura (ABin a){//Que testa se uma árvore é de procura
   int r=deDeProcura(a);
   if(r!=nodos(a)){
       r=0;
   }else{
       r=1;
   }
   return r;
}

int pruneAB (ABin *a, int l){//Que remove (libertando o espaço respetivo) todos os elementos da árvore *a que estão a uma profundidade superior a l, retornando o número de elementos removidos


}

//////////////////////////////////////////////////////////////// PARTE B //////////////////////////////////////////////////////////////////////////////

typedef struct digito {
    unsigned char val;  //Número de 0 a 9 (Lista vazia representa o 0)
    struct digito *prox;
} *Num;

//O número 1234 é representado pela lista 4->3->2->1

void imprimeLD (Num l){//Imprime no ecrân a lista de digitos
   Num aux=l;

   while(aux!=NULL){
       printf("%c ", aux->val);
       aux=aux->prox;
   }
}

void newDigitFim (Num *l,unsigned i){//Acrescenta no fim da lista de dígitos um novo digito
   Num aux=*l,novo;

   while(aux!=NULL && aux->prox!=NULL){
       aux=aux->prox;
   }
   novo=malloc(sizeof(struct digito));
   novo->val=i;
   novo->prox=NULL;
   if(aux!=NULL){
       aux->prox=novo;
   }else{
       *l=novo;
   }
}

Num fromInt (unsigned int i){//Converte um unsigned int numa lista de digitos
   unsigned int seg=i,numero;
   Num novo,r=NULL;

   while(seg>=10){
       numero=seg%10;
       seg=seg/10;
       newDigitFim(&r,numero);
   }
   newDigitFim(&r,seg);
   return r;
}

int potencia (int x, int n){//Devolve o valor de x^n
   int r=1;
   
   while(n>0){
       r*=x;
       n--;
   }
   return r;
}

unsigned int toInt (Num m){//Converte uma lista de digitos num unsigned int
   unsigned int r=0;
   int pos=0;
   Num aux=m;

   while(aux!=NULL){
       if(pos==0){
           r+=aux->val;
           pos++;
       }else{
           r+=aux->val*potencia(10,pos);
           pos++;
       }
       aux=aux->prox;
   }
   return r;
}

Num addNum (Num a, Num b){//Soma duas listas de digitos
   unsigned int soma,seg=0;
   Num resultado=NULL,novo;
   
   while(a!=NULL && b!=NULL){
       if(seg==1){
           soma=a->val+b->val+1;
       }else{
           soma=a->val+b->val;
       }
       if(soma>=10){
           soma-=10;
           seg=1;
       }else{
           seg=0;
       }
       newDigitFim(&resultado,soma);
       a=a->prox;
       b=b->prox;
   }
   if(a!=NULL){
       while(a!=NULL){
           if(seg==1){
               soma=a->val+1;
           }else{
               soma=a->val+1;   
           }
           if(soma>10){
              soma-=10;
              seg=1;
           }else{
               if(soma==10){
                   newDigitFim(&resultado,0);
                   seg=1;
               }else{
                   seg=0;
               }
           }
           newDigitFim(&resultado,soma);
           a=a->prox;
       }
   }else{
       if(b!=NULL){
           while(b!=NULL){
                if(seg==1){
                   soma=b->val+1;
                }else{
                   soma=b->val+1;   
                }
                if(soma>10){
                   soma-=10;
                   seg=1;
                }else{
                   if(soma==10){
                      newDigitFim(&resultado,0);
                      seg=1;
                   }else{
                      seg=0;
                   }
               }
                newDigitFim(&resultado,soma);
                b=b->prox;
            }
       }
   }
   return resultado;
} 

Num addNum1 (Num a, Num b){//Soma duas listas de digitos
   Num resultado;
   unsigned int c=toInt(a),d=toInt(b);
   unsigned int e=c+d;
   
   resultado=fromInt(e);
   return resultado;
}

Num mulDig (unsigned char dig, Num a){//Que multiplica um digito (um número de 0 a 9) por uma lista de digitos

}

Num mulDig1 (unsigned char dig, Num a){//Que multiplica um digito (um número de 0 a 9) por uma lista de digitos
   Num resultado;
   unsigned int b=toInt(a);
   unsigned int c=b*dig;

   resultado=fromInt(c);
   return resultado;
}

int main(){
   int i,a;
   unsigned int b=9876;
   unsigned int c=987;
   Num teste1=fromInt(b);
   Num teste2=fromInt(c);
   Num teste3=addNum(teste1,teste2);
   imprimeLD(teste3);
}