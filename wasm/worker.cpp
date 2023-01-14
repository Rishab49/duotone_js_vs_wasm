#include<iostream>
#include<emscripten.h>

extern "C"{



EMSCRIPTEN_KEEPALIVE
void  convert_to_greyscale(uint8_t * pixels,unsigned long int length){

        std::cout<<"running"<<std::endl;
        std::cout<<"length"<<length<<std::endl;
        std::cout<<*pixels<<std::endl;
    for(unsigned long int i=0;i<length;i+=4){
        uint8_t r = *(pixels + i + 0);
        uint8_t g = *(pixels + i + 1);
        uint8_t b = *(pixels + i + 2);
        uint8_t avg =(r + g + b)/3;
        // int avg = floor(0.299 * r+ 0.587 * g + 0.114 * b);
        *(pixels + i + 0) = avg;
        *(pixels + i + 1) = avg;
        *(pixels + i + 2) = avg;
    }
}


EMSCRIPTEN_KEEPALIVE
void create_gradient(int r1,int g1,int b1,int r2,int g2,int b2,uint8_t * gradient){
  for (int i = 0; i < (256*4); i += 4) {
    *(gradient + i) = ((256-(i/4))*r1 + (i/4)*r2)/256;
    *(gradient+i + 1) = ((256-(i/4))*g1 + (i/4)*g2)/256;
    *(gradient+i + 2) = ((256-(i/4))*b1 + (i/4)*b2)/256;
    *(gradient+i + 3) = 255;
  }  
}


EMSCRIPTEN_KEEPALIVE
void create_duotone(uint8_t * d,uint8_t * gradient,unsigned long int length,uint8_t * duotone){

  for (unsigned long int i = 0; i < length; i += 4) {
    *(duotone + i) = *(gradient + (*(d + i)*4));
    *(duotone + i + 1) =*(gradient + (*(d + i)*4) + 1);
    *(duotone + i + 2) =*(gradient + (*(d + i)*4) + 2);
    *(duotone + i + 3) = 255;
  }
}
}
// em++ worker.cpp -sEXPORTED_FUNCTIONS=['_malloc','_free'] -sEXPORTED_RUNTIME_METHODS=['ccall'] -sMODULARIZE -sALLOW_MEMORY_GROWTH=1