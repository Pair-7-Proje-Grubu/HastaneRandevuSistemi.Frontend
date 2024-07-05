import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatIconModule,
    ],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent { 
    faqs: FAQ[] = [
        {
          question: 'Randevuyu nasıl planlarım?',
          answer: 'Bizimle randevu planlamak için, mesai saatleri içinde ofisimizi arayabilir veya web sitemizde bulunan online randevu alma sistemimizi kullanabilirsiniz. Sadece tercih ettiğiniz tarih ve saati seçin ve randevu ekibimiz randevunuzu onaylasın.',
          isOpen: false
        },
        {
          question: 'Sigortamı kabul ediyor musunuz?',
          answer: 'Çeşitli sigorta planlarını kabul ediyoruz. Daha fazla bilgi için lütfen ofisimizle iletişime geçin.',
          isOpen: false
        },
        {
          question: 'Telefonla da randevu sunuyor musunuz?',
          answer: 'Evet, size kolaylık sağlamak için telefonla da randevu sağlıyoruz. Lütfen bir randevu ayarlamak için bizimle iletişime geçin.',
          isOpen: false
        },
        {
          question: 'Randevuma ne getirmeliyim?',
          answer: 'Lütfen geçerli bir kimlik belgesi, sigorta kartınız ve ilgili tıbbi kayıtlarınızı getirin.',
          isOpen: false
        },
        {
          question: 'Çevrimiçi olarak reçete yenileme talebinde bulunabilir miyim?',
          answer: 'Evet, hasta portalımız aracılığıyla reçete yenileme talebinde bulunabilirsiniz.',
          isOpen: false
        },
        {
          question: 'COVID-19 sırasında yüz yüze randevular için hangi güvenlik önlemleri alınmaktadır?',
          answer: 'Hasta ve personelimizin güvenliğini sağlamak için CDC yönergelerine uyuyoruz. Bu kapsamda artırılmış temizlik protokolleri ve zorunlu maske kullanımı gibi önlemler alınmaktadır.',
          isOpen: false
        }
      ];

      toggleFaq(faq: FAQ): void {
        faq.isOpen = !faq.isOpen;
      }
}
