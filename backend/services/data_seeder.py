from motor.motor_asyncio import AsyncIOMotorDatabase
from models.event_models import EventPackage, PhotoboothPackage, AdditionalService
from models.contact_models import Testimonial
import logging

logger = logging.getLogger(__name__)

async def seed_initial_data(db: AsyncIOMotorDatabase):
    """Seed the database with initial data from mockData.js"""
    
    # Check if data already exists
    existing_packages = await db.event_packages.count_documents({})
    if existing_packages > 0:
        logger.info("Data already exists, skipping seed")
        return
    
    logger.info("Seeding initial data...")
    
    # Event Packages - Mariage
    mariage_packages = [
        EventPackage(
            id="mariage-bronze",
            name="PACK BRONZE",
            type="mariage",
            price=450,
            features=[
                "DJ professionnel jusqu'à 3h00",
                "Sonorisation du vin d'honneur",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme (option)",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="mariage-argent",
            name="PACK ARGENT",
            type="mariage",
            price=550,
            features=[
                "DJ professionnel jusqu'à 4h00",
                "Sonorisation du vin d'honneur",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="mariage-or",
            name="PACK OR",
            type="mariage",
            price=650,
            features=[
                "DJ professionnel jusqu'à 5h00",
                "Sonorisation du vin d'honneur",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme (8 par led)",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        )
    ]
    
    # Event Packages - Anniversaire
    anniversaire_packages = [
        EventPackage(
            id="anniversaire-bronze",
            name="PACK BRONZE",
            type="anniversaire",
            price=350,
            features=[
                "DJ professionnel jusqu'à 3h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="anniversaire-argent",
            name="PACK ARGENT",
            type="anniversaire",
            price=450,
            features=[
                "DJ professionnel jusqu'à 4h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="anniversaire-or",
            name="PACK OR",
            type="anniversaire",
            price=500,
            features=[
                "DJ professionnel jusqu'à 5h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme (6 par led)",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        )
    ]
    
    # Event Packages - Baptême
    bapteme_packages = [
        EventPackage(
            id="bapteme-bronze",
            name="PACK BRONZE",
            type="bapteme",
            price=350,
            features=[
                "DJ professionnel jusqu'à 3h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="bapteme-argent",
            name="PACK ARGENT",
            type="bapteme",
            price=450,
            features=[
                "DJ professionnel jusqu'à 4h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        ),
        EventPackage(
            id="bapteme-or",
            name="PACK OR",
            type="bapteme",
            price=500,
            features=[
                "DJ professionnel jusqu'à 5h00",
                "Sonorisation de la piste de danse",
                "Animation complète",
                "Vidéo-projection sur la salle de réception",
                "Éclairage de la piste de danse haut de gamme",
                "Micro HF",
                "Décoration lumineuse haut de gamme (6 par led)",
                "Machine à effet : machine à fumée classique ou lourde",
                "Organisation personnalisé de votre événement incluant un rendez-vous de préparation"
            ]
        )
    ]
    
    # Insert all event packages
    all_event_packages = mariage_packages + anniversaire_packages + bapteme_packages
    for pkg in all_event_packages:
        await db.event_packages.insert_one(pkg.dict())
    
    # Photobooth Packages
    photobooth_packages = [
        PhotoboothPackage(
            id="photo-one",
            name="PHOTO ONE",
            price=139,
            features=[
                "PHOTO NUMÉRIQUES ILLIMITÉES",
                "CLÉ USB FOURNIE",
                "LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS",
                "Prise de vue en selfie avec Reflex et Objectif à focale variable",
                "Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm",
                "Galerie digitale connectée",
                "Création de gifs, vidéos courtes",
                "Partage par mail et sur les réseaux sociaux",
                "Personnalisation de la photo et de la borne",
                "Accessoires virtuels et Fonds verts",
                "Assistance téléphonique 24/24"
            ]
        ),
        PhotoboothPackage(
            id="photo-two",
            name="PHOTO TWO",
            price=180,
            features=[
                "200 TIRAGE",
                "PHOTO NUMÉRIQUES ILLIMITÉES",
                "CLÉ USB FOURNIE",
                "LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS",
                "Prise de vue en selfie avec Reflex et Objectif à focale variable",
                "Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm",
                "Galerie digitale connectée",
                "Création de gifs, vidéos courtes",
                "Partage par mail et sur les réseaux sociaux",
                "Personnalisation de la photo et de la borne",
                "Accessoires virtuels et Fonds verts",
                "Assistance téléphonique 24/24"
            ]
        ),
        PhotoboothPackage(
            id="photo-three",
            name="PHOTO THREE",
            price=249,
            features=[
                "400 TIRAGE",
                "PHOTO NUMÉRIQUES ILLIMITÉES",
                "CLÉ USB FOURNIE",
                "LIEN POUR TÉLÉCHARGER TOUTES VOS PHOTOS",
                "Prise de vue en selfie avec Reflex et Objectif à focale variable",
                "Impression immédiate aux formats 5x15cm, 10×15cm ou 15×20 cm",
                "Galerie digitale connectée",
                "Création de gifs, vidéos courtes",
                "Partage par mail et sur les réseaux sociaux",
                "Personnalisation de la photo et de la borne",
                "Accessoires virtuels et Fonds verts",
                "Assistance téléphonique 24/24"
            ]
        )
    ]
    
    for pkg in photobooth_packages:
        await db.photobooth_packages.insert_one(pkg.dict())
    
    # Additional Services
    additional_services = [
        AdditionalService(
            id="mange-debout",
            name="Location mange debout",
            price=5,
            unit="pièce",
            description="Tables hautes élégantes pour vos réceptions"
        ),
        AdditionalService(
            id="candy-bar",
            name="Candy bar",
            price=15,
            unit="week-end",
            description="Bar à bonbons personnalisé pour vos événements"
        ),
        AdditionalService(
            id="personnalisation",
            name="Personnalisation d'objets",
            description="Gobelets, souvenirs, etc. personnalisés",
            custom=True
        )
    ]
    
    for service in additional_services:
        await db.additional_services.insert_one(service.dict())
    
    # Sample Testimonials
    testimonials = [
        Testimonial(
            name="Sophie & Pierre Martin",
            event="Mariage - Pack Or",
            text="JSEVENT a rendu notre mariage absolument magique ! L'équipe est professionnelle et l'animation était parfaite. Nos invités en parlent encore !",
            rating=5,
            is_approved=True
        ),
        Testimonial(
            name="Famille Dubois",
            event="Anniversaire - Pack Argent",
            text="Organisation impeccable pour les 50 ans de mon mari. Le DJ était formidable et l'éclairage a créé une ambiance extraordinaire.",
            rating=5,
            is_approved=True
        ),
        Testimonial(
            name="Marie et Thomas",
            event="Baptême - Pack Bronze",
            text="Service de qualité pour le baptême de notre fille. L'équipe s'est adaptée parfaitement à nos demandes. Merci !",
            rating=5,
            is_approved=True
        )
    ]
    
    for testimonial in testimonials:
        await db.testimonials.insert_one(testimonial.dict())
    
    logger.info("Initial data seeded successfully")