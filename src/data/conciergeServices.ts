import { ConciergeService } from '../types/concierge';

export const conciergeServices: ConciergeService[] = [
  {
    id: 'repassage',
    name: 'Repassage',
    slug: 'repassage',
    shortDescription: 'Les jeunes de l\'église vous proposent un service de repassage soigné',
    fullDescription: 'Les jeunes de notre église mettent leurs compétences à votre service pour repasser vos vêtements avec soin et attention. Chemises, pantalons, robes ou linge de maison, ils prennent le temps de bien faire les choses. C\'est l\'occasion pour eux de développer leur sens du service tout en finançant leur participation à Echo 2026. Service à domicile possible.',
    icon: 'Shirt'
  },
  {
    id: 'tonte-gazon',
    name: 'Tonte de gazon',
    slug: 'tonte-gazon',
    shortDescription: 'Les jeunes entretiennent votre pelouse avec motivation',
    fullDescription: 'Nos jeunes sont motivés pour entretenir votre jardin ! Équipés de tondeuses et d\'outils adaptés, ils s\'occupent de tondre votre gazon, ramasser l\'herbe coupée et tailler les bordures. C\'est une belle opportunité pour eux d\'apprendre le travail manuel et la persévérance, tout en vous rendant service. Service régulier ou ponctuel selon vos besoins.',
    icon: 'Scissors'
  },
  {
    id: 'dechetterie',
    name: 'Ramassage à la déchèterie',
    slug: 'ramassage-dechetterie',
    shortDescription: 'Les jeunes vous aident à transporter vos encombrants',
    fullDescription: 'Besoin de vous débarrasser d\'encombrants, vieux meubles ou déchets volumineux ? Les jeunes de l\'église sont là pour vous aider ! Ils viennent récupérer vos affaires, les chargent avec précaution et les transportent à la déchèterie. C\'est un service physique qui leur permet de mettre leur énergie au service de la communauté tout en apprenant la responsabilité environnementale.',
    icon: 'Trash2'
  },
  {
    id: 'montage-meubles',
    name: 'Montage de meubles',
    slug: 'montage-meubles',
    shortDescription: 'Les jeunes assemblent vos meubles en kit avec patience',
    fullDescription: 'Vous avez des meubles en kit à monter ? Les jeunes de notre église adorent les défis ! Armés de tournevis et de patience, ils suivent les instructions pour assembler vos bibliothèques, armoires, lits ou bureaux. C\'est une excellente façon pour eux de développer leur logique, leur dextérité et leur esprit d\'équipe. Ils apportent leur bonne humeur et leur détermination !',
    icon: 'Wrench'
  },
  {
    id: 'demenagement',
    name: 'Déménagement',
    slug: 'demenagement',
    shortDescription: 'Les jeunes vous accompagnent dans votre déménagement',
    fullDescription: 'Un déménagement en vue ? Les jeunes de l\'église forment une équipe solidaire et dynamique pour vous aider ! Emballage, portage, chargement, transport et installation dans votre nouveau logement. C\'est un travail d\'équipe qui leur apprend l\'entraide, la coordination et la persévérance. Ils mettent leur force et leur énergie au service de votre projet, tout en finançant le leur : Echo 2026.',
    icon: 'Truck'
  },
  {
    id: 'livraison-gateaux',
    name: 'Livraison de gâteaux',
    slug: 'livraison-gateaux',
    shortDescription: 'Les jeunes livrent vos pâtisseries avec le sourire',
    fullDescription: 'Les jeunes de l\'église se font un plaisir de livrer vos gâteaux et pâtisseries ! Que ce soit pour un anniversaire, un événement spécial ou simplement pour vous faire plaisir, ils transportent vos commandes avec soin et attention. C\'est l\'occasion pour eux de développer leur sens du service client et leur ponctualité, tout en partageant leur joie de vivre. Livraison rapide et soignée garantie !',
    icon: 'Cake'
  },
  {
    id: 'lavage-voiture',
    name: 'Lavage de voiture',
    slug: 'lavage-voiture',
    shortDescription: 'Les jeunes nettoient votre véhicule avec application',
    fullDescription: 'Votre voiture a besoin d\'un bon nettoyage ? Les jeunes de notre église s\'en occupent avec enthousiasme ! Lavage extérieur, nettoyage des jantes, aspiration intérieure, nettoyage des sièges et du tableau de bord. Ils apprennent le souci du détail et la satisfaction du travail bien fait. C\'est un service qui leur permet de développer leur sens de la qualité tout en vous rendant service. À domicile ou sur place.',
    icon: 'Car'
  },
  {
    id: 'babysitting',
    name: 'Babysitting',
    slug: 'babysitting',
    shortDescription: 'Les jeunes gardent vos enfants avec responsabilité',
    fullDescription: 'Les jeunes de l\'église, responsables et bienveillants, proposent de garder vos enfants. Jeux, activités créatives, aide aux devoirs, ils savent s\'adapter aux besoins de chaque enfant. C\'est une belle opportunité pour eux de développer leur sens des responsabilités et leur patience, tout en créant des liens intergénérationnels. Garde ponctuelle ou régulière, avec des jeunes motivés et de confiance.',
    icon: 'Baby'
  },
  {
    id: 'rangement',
    name: 'Rangement',
    slug: 'rangement',
    shortDescription: 'Les jeunes vous aident à organiser vos espaces',
    fullDescription: 'Besoin d\'aide pour ranger et organiser votre maison ? Les jeunes de l\'église sont là pour vous épauler ! Désencombrement, tri, organisation du dressing, de la cuisine, du garage ou du bureau. Ils apportent leur énergie et leurs idées fraîches pour vous aider à retrouver un espace harmonieux. C\'est un service qui leur enseigne l\'organisation et la méthode, tout en vous simplifiant la vie.',
    icon: 'Package'
  }
];
