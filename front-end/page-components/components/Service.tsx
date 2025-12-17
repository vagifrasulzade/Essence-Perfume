import { Glasses, Headphones } from 'lucide-react';
import Image from 'next/image';

export default function Service() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[400px] bg-linear-to-br from-[#d5aa65] to-[#c5ad87] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Service</h1>
        
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <Image src="/assets/service/Service.webp" alt="Perfume" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">Making hearts come close to each other</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Phasellus ullamcorper sem ac sagittis mollis. Aenean sit amet ex quis nisi gravida fermentum. Maecenas dapibus magna ac tempus aliquam. Donec scelerisque nisl id malesuada dapibus. Nunc ut eros arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut mi ipsum, aliquet ac lorem sed, condimentum suscipit nisi. Sed tempor nulla non molestie sagittis.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-bold">&#9656;</span>
                  <span>Fresh Florals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">&#9656;</span>
                    <span>Heaven Scent</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-bold">&#9656; </span>
                    <span>Sensual Scents</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">&#9656; </span>
                    <span>Spiritual Scents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">The Traditional Fragrance</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="flex gap-6">
              <div className='shrink-0'>
                <Glasses className="w-16 h-16 flex items-center justify-center"/>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">A fragrance that makes you go crazy</h3>
                <p className="text-muted-foreground leading-relaxed font-serif">
                  Shoes really are a never-ending product. Never-ending for us and never-ending for every fashion lover. Style, the variety of models, materials, textures, footwear, statistics and spoken yet. So we've gathered some very interesting facts about your feet and the footwear on them.
                </p>
              </div>
            </div>

            <div className='flex gap-6'>
              <div className='shrink-0'>
                <Headphones className="w-16 h-16 flex items-center justify-center"/>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">A perfume that makes you marvellous</h3>
                <p className="text-muted-foreground leading-relaxed font-serif">
                  Our ethnic look by wears are beautiful from the our house. It has a mandarin collection and three quarter collection which give you a chi look. The printed pattern on the dress adds lot to its appeal. It has been crafted with a rayon fabric that will keep you at ease all day long.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: title, intro, and service items */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold uppercase mb-6">Our Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Axeo as a fashion brand, is breaking new ground and creating intelligent apparel that is anti-stain,
                anti-odour and cooler! empowers small and medium-sized businesses to reach millions of customers with a
                number of programmer that help boost their revenue, reach and productivity. We celebrate those special
                products that were made for world wide customers.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                <div>
                  <div className="text-primary font-semibold mb-2">01. <span className="text-foreground font-bold">Visit Store</span></div>
                  <p className="text-muted-foreground font-serif">
                    Offers outstanding unique shopping experience is our top priority. Visit online today enjoy collections
                  </p>
                </div>

                <div>
                  <div className="text-primary font-semibold mb-2">02. <span className="text-foreground font-bold">Add To Cart</span></div>
                  <p className="text-muted-foreground font-serif">
                    Add your cart with trending collection stylish hair wigs . Start your make over today
                  </p>
                </div>

                <div>
                  <div className="text-primary font-semibold mb-2">03. <span className="text-foreground font-bold">Gift Cards</span></div>
                  <p className="text-muted-foreground font-serif">
                    Shop now and collect your exiting gifts for all occasion. Perfect gift for you and loved once
                  </p>
                </div>

                <div>
                  <div className="text-primary font-semibold mb-2">04. <span className="text-foreground font-bold">Unique shop</span></div>
                  <p className="text-muted-foreground font-serif">
                    Relax and enjoy your collection! We believe everyone can and deserves to be beautiful
                  </p>  
                </div>
              </div>
            </div>

            {/* Right: image */}
            <div className='flex justify-center'>
              <div className="relative h-[500px] w-[500px] rounded-lg overflow-hidden">
                <Image src="/assets/service/Service2.webp" alt="Our services" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
