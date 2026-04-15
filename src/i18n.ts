import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        catalogue: 'Catalog',
        more: 'More',
        privacy: 'Privacy',
        legal: 'Legal notice',
      },
      home: {
        title: 'Identification Key',
        subtitle: 'A Guide to Sugarcane Diseases',
        hint: 'Answer a few questions about the observed symptoms\nto identify the disease.',
        cta: 'Start diagnosis',
      },
      catalogue: {
        title: 'Catalog',
        subtitle: 'Complete list of referenced diseases',
        empty: 'The catalog will be available once cle.json is loaded.',
      },
      privacy: {
        title: 'Privacy Policy',
        dataHeading: 'Data collected',
        dataBody: 'This application collects no personal data. No cookies, no trackers, no analytics.',
        offlineHeading: 'Offline use',
        offlineBody: 'The application may be cached by your browser (PWA). This data remains exclusively on your device.',
        controllerHeading: 'Controller',
        controllerBody: 'CIRAD — French agricultural research and cooperation organisation working for the sustainable development of tropical and Mediterranean regions.',
      },
      legal: {
        title: 'Legal Notice',
        publisherHeading: 'Publisher',
        publisherBody: 'CIRAD — Centre de coopération internationale en recherche agronomique pour le développement.',
        hostingHeading: 'Hosting',
        hostingBody: 'Hosted by CIRAD.',
        creditsHeading: 'Credits',
        creditsBody: 'Based on the book "A Guide to Sugarcane Diseases". Application developed for CIRAD.',
      },
      notFound: 'Page not found',
      backHome: 'Back to home',
    },
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        catalogue: 'Catalogue',
        more: 'Plus',
        privacy: 'Confidentialité',
        legal: 'Mentions légales',
      },
      home: {
        title: "Clé d'identification",
        subtitle: 'Guide des maladies de la canne à sucre',
        hint: 'Répondez à quelques questions sur les symptômes observés\npour identifier la maladie.',
        cta: 'Commencer le diagnostic',
      },
      catalogue: {
        title: 'Catalogue',
        subtitle: 'Liste complète des maladies référencées',
        empty: 'Le catalogue sera disponible une fois le fichier cle.json chargé.',
      },
      privacy: {
        title: 'Politique de confidentialité',
        dataHeading: 'Données collectées',
        dataBody: "Cette application ne collecte aucune donnée personnelle. Aucun cookie, aucun tracker, aucune analytics.",
        offlineHeading: 'Fonctionnement hors connexion',
        offlineBody: "L'application peut être mise en cache par votre navigateur (PWA). Ces données restent exclusivement sur votre appareil.",
        controllerHeading: 'Responsable',
        controllerBody: 'CIRAD — Centre de coopération internationale en recherche agronomique pour le développement.',
      },
      legal: {
        title: 'Mentions légales',
        publisherHeading: 'Éditeur',
        publisherBody: 'CIRAD — Centre de coopération internationale en recherche agronomique pour le développement.',
        hostingHeading: 'Hébergement',
        hostingBody: 'Hébergé par le CIRAD.',
        creditsHeading: 'Crédits',
        creditsBody: "Basé sur l'ouvrage « A Guide to Sugarcane Diseases ». Application développée pour le CIRAD.",
      },
      notFound: 'Page introuvable',
      backHome: "Retour à l'accueil",
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        catalogue: 'Catálogo',
        more: 'Más',
        privacy: 'Privacidad',
        legal: 'Aviso legal',
      },
      home: {
        title: 'Clave de identificación',
        subtitle: 'Guía de enfermedades de la caña de azúcar',
        hint: 'Responda algunas preguntas sobre los síntomas observados\npara identificar la enfermedad.',
        cta: 'Iniciar diagnóstico',
      },
      catalogue: {
        title: 'Catálogo',
        subtitle: 'Lista completa de enfermedades referenciadas',
        empty: 'El catálogo estará disponible una vez cargado el archivo cle.json.',
      },
      privacy: {
        title: 'Política de privacidad',
        dataHeading: 'Datos recopilados',
        dataBody: 'Esta aplicación no recopila datos personales. Sin cookies, sin rastreadores, sin analytics.',
        offlineHeading: 'Uso sin conexión',
        offlineBody: 'La aplicación puede ser almacenada en caché por su navegador (PWA). Estos datos permanecen exclusivamente en su dispositivo.',
        controllerHeading: 'Responsable',
        controllerBody: 'CIRAD — Centro de cooperación internacional en investigación agronómica para el desarrollo.',
      },
      legal: {
        title: 'Aviso legal',
        publisherHeading: 'Editor',
        publisherBody: 'CIRAD — Centro de cooperación internacional en investigación agronómica para el desarrollo.',
        hostingHeading: 'Alojamiento',
        hostingBody: 'Alojado por CIRAD.',
        creditsHeading: 'Créditos',
        creditsBody: 'Basado en el libro "A Guide to Sugarcane Diseases". Aplicación desarrollada para CIRAD.',
      },
      notFound: 'Página no encontrada',
      backHome: 'Volver al inicio',
    },
  },
}

await i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'dcas-lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18next
