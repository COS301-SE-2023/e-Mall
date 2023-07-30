import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ProfileFacade } from '../profile/services/profile.facade';
import { ISellerProfile } from '../profile/models/seller-profile.interface';
import { IConsumerProfile } from '../profile/models/consumer-profile.interface';
import { Observable, of } from 'rxjs';
import { EmailValidator, FormControl, FormGroup } from '@angular/forms';
import { IProduct } from '@shared/models/product/product.interface';
import { ConsumerService } from '@shared/servicies/consumer/consumer.service';
//import { AuthFacade } from '@app/features/auth/services/auth.facade';
//import { IUser } from '@app/features/auth/models/user.interface';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  products$!: Observable<IProduct[] | null>;

  bool = true;
  //isAuthenticated: Observable<IUser | null>;
  customerprofileForm: FormGroup;
  profile$: Observable<ISellerProfile | IConsumerProfile | null>;
  email!: string;

  constructor(
    private router: Router,
    public profileFacade: ProfileFacade,
    private consumerService: ConsumerService
  ) {
    this.customerprofileForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      details: new FormControl(),
    });

    this.profile$ = this.profileFacade.getProfile();
  }

  /*constructor(
    private router: Router,
    /*private authFacade: AuthFacade) {
      //this.isAuthenticated = this.authFacade.getCurrentUser();
     }*/

  ngOnInit(): void {
    this.profile$.subscribe(profile => {
      if (profile) {
        this.email = profile.email;
      }
    });
    console.log(this.email);
    this.consumerService.getConsumerInfo(this.email).subscribe(data => {
      console.log(data.products);
      this.products$ = of(data.products);
    });
  }
  goToCustomerProfile() {
    this.router.navigate(['/customer-profile']);
  }

  goToConstruction() {
    this.router.navigate(['/construction']);
  }

  public signOut(): void {
    this.router.navigate(['sign-out']);
  }

  getData(): Observable<IProduct[] | null> {
    return of(data);
  }

  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1)
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';

    return imgList[0];
  }

  goToProductPage(prod_id: number): void {
    // Create the navigation extras object with the search query as a parameter

    const navigationextras: NavigationExtras = {
      queryParams: { prod_id: prod_id },
    };

    this.router.navigate(['products'], navigationextras);
  }
}

export const data: IProduct[] = [
  {
    id: 25,
    min_price_original_price: 30,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 30,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/One-Punch-Man-Vol-1-ONE/dp/1421585642/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: true,
    min_price_img_array: [
      'https://media.takealot.com/covers_isbn/9781421585642-zoom.jpg',
    ],
    name: 'One-Punch Man, Vol. 1 (Paperback / softback)',
    description:
      'Nothing about Saitama passes the eyeball test when it comes to superheroes, from his lifeless expression to his bald head to his unimpressive physique. However, this average-looking guy has a not-so-average problem—he just can’t seem to find an opponent strong enough to take on!Every time a promising villain appears, Saitama beats the snot out of ’em with one punch! Can he finally find an opponent who can go toe-to-toe with him and give his life some meaning? Or is he doomed to a life of superpowered boredom?',
    brand: 'ONE',
    category: 'books',
    created_at: '2023-07-17T15:13:07.459467Z',
    updated_at: '2023-07-17T15:13:07.459473Z',
  },
  {
    id: 22,
    min_price_original_price: 46,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 46,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-2/dp/1974710033/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: false,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/66773ecf56a6472d9a2d0081dc0b088a/s-zoom.file',
    ],
    name: 'Jujutsu Kaisen, Vol. 2 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.456257Z',
    updated_at: '2023-07-17T15:13:07.456264Z',
  },
  {
    id: 23,
    min_price_original_price: 65,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 65,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-8/dp/1974718719/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: false,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/ceb77e4a27354e32860ac255708b655c/s-zoom.file',
    ],
    name: 'Jujutsu Kaisen, Vol. 8 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.457703Z',
    updated_at: '2023-07-17T15:13:07.457710Z',
  },
  {
    id: 21,
    min_price_original_price: 118,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 118,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-1/dp/1974710025/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: true,
    min_price_img_array: [
      'https://media.takealot.com/covers_isbn/9781974710027-zoom.jpg',
    ],
    name: 'Jujutsu Kaisen, Vol. 1 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.455259Z',
    updated_at: '2023-07-17T15:13:07.455266Z',
  },
  {
    id: 26,
    min_price_original_price: 132,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 132,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-7/dp/1974717119/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: false,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/d3873741a7c44f118fdb98349e73d31c/s-zoom.file',
    ],
    name: 'Jujutsu Kaisen, Vol. 7 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.458765Z',
    updated_at: '2023-07-17T15:13:07.458771Z',
  },
  {
    id: 17,
    min_price_original_price: 135,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 135,
    min_price_seller_id: 'dbe5d4c2-de1c-412b-98fb-5cde2c1e5c96',
    min_price_seller_product_url:
      'https://www.takealot.com/oxford-mini-school-dictionary/PLID43753248',
    min_price_seller_business_name: 'Takealot',
    min_price_in_stock: true,
    min_price_img_array: [
      'https://m.media-amazon.com/images/I/91L2J55qn7L.jpg',
      'https://m.media-amazon.com/images/I/A11Y0pXXBDL.jpg',
      'https://media.takealot.com/covers_isbn/9780192747082-zoom.jpg',
    ],
    name: 'Oxford Mini School Dictionary ',
    description: 'OXFORD MINI SCHOOL DICTIONARY',
    brand: 'Oxford',
    category: 'books',
    created_at: '2023-07-17T15:13:07.449497Z',
    updated_at: '2023-07-17T15:13:07.449506Z',
  },
  {
    id: 27,
    min_price_original_price: 140,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 140,
    min_price_seller_id: 'bb45005d-a544-4a75-870f-9f8ae48b015c',
    min_price_seller_product_url:
      'https://www.makro.co.za/baby-toddlers-kids/toys/kids-toys/action-play/action-play/thomas-friends-moments-engine/p/000000000000396329_EA',
    min_price_seller_business_name: 'Makro',
    min_price_in_stock: true,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/d92e159fdbe247599be3e2e9c0073a24/s-zoom.file',
      'https://media.takealot.com/covers_images/6bc7d0141f964d33af60d72ab3110955/s-zoom.file',
      'https://media.takealot.com/covers_images/94505170a1d8480f85ae8a36002dec68/s-zoom.file',
    ],
    name: 'Thomas & Friends Color Changers, Push Along Diecast Engines',
    description:
      'Set of 9 die-cast metal, push-along engines featuring Thomas & Friends characters Thomas, Percy, Kana, Diesel, Hiro, Farona, Frederico, Jiff & Riff',
    brand: 'Mattel',
    category: 'toys and games',
    created_at: '2023-07-17T15:13:07.461435Z',
    updated_at: '2023-07-17T15:13:07.461440Z',
  },
  {
    id: 14,
    min_price_original_price: 132,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 132,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-7/dp/1974717119/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: false,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/d3873741a7c44f118fdb98349e73d31c/s-zoom.file',
    ],
    name: 'Jujutsu Kaisen, Vol. 7 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.458765Z',
    updated_at: '2023-07-17T15:13:07.458771Z',
  },
  {
    id: 12,
    min_price_original_price: 46,
    min_price_discount: 0,
    min_price_discount_rate: 0,
    min_price: 46,
    min_price_seller_id: 'f944186f-8587-4c07-a35d-0dd44d6747a7',
    min_price_seller_product_url:
      'https://www.amazon.com/Jujutsu-Kaisen-Vol-2/dp/1974710033/',
    min_price_seller_business_name: 'Amazon',
    min_price_in_stock: false,
    min_price_img_array: [
      'https://media.takealot.com/covers_images/66773ecf56a6472d9a2d0081dc0b088a/s-zoom.file',
    ],
    name: 'Jujutsu Kaisen, Vol. 2 (Paperback / softback)',
    description:
      "Yuji Itadori is resolved to save the world from cursed demons, but he soon learns that the best way to do it is to slowly lose his humanity and become one himself!In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryoma Sukuna were lost and scattered about. Should any demon consume Sukuna's body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the undead!",
    brand: 'Gege Akutami',
    category: 'books',
    created_at: '2023-07-17T15:13:07.456257Z',
    updated_at: '2023-07-17T15:13:07.456264Z',
  },
];
