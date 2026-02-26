const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const text = `Rage

Quels sont les gestes à faire chez un patient présentant une morsure grave (grade 3) par un chien connu et suspect de rage:

a) Il faut suturer rapidement la plaie avant de faire une sérothérapie
b) Il faut tuer le chien
c) Il faut faire un lavage de la plaie + sérovaccination du patient
d) Mettre le chien en observation
e) Il faut vacciner le chien

La rage est une zoonose transmise à l'homme par la salive des animaux infectés. Quel est parmi les modes de contamination suivants celui qui ne transmet pas le virus:

a) La morsure
b) Les griffures avec léchage de la plaie
c) Le léchage sur peau saine
d) L'inhalation dans des grottes abritant des chauves-souris
e) La greffe de cornées infectées

Staphylococcie

Le réservoir de staphylocoque est représenté par:

a) L'homme sain à partir de son naso-pharynx
b) L'homme sain à partir de la peau et des glandes sudoripares
c) Un patient porteur de lésions staphylococciques ouvertes
d) Les mains du personnel soignant
e) Des voies génitales infectées

Parmi les signes cliniques suivants lesquels caractérisent le placard staphylococcique :

a) Il est rouge violacé
b) Il est entouré d'un bourrelet inflammatoire
c) Il est froid
d) Il contient des germes au niveau des vésicules
e) Il est souvent bilatéral

Parmi les lésions cutanées suivantes, lesquelles contiennent du staphylocoque ?

a) Les furoncles
b) Le sycosis de la barbe
c) Les panaris
d) L'érythème polymorphe
e) L'orgelet

Quelles sont les propositions exactes concernant le staphylocoque Auréus:

a) Il peut élabore une exotoxine
b) Il est en cause dans l'anthrax
c) Il possède de nombreux facteurs de virulence
d) Il est toujours pathogène pour l'homme
e) Il est coagulase positive

Les staphylocoques peuvent être en cause:

a) Dans les toxi-infections alimentaires
b) Dans les staphylococcies malignes de la face
c) Dans les endocardites sur prothèses
d) Dans les infections nosocomiales sur cathéter
e) Dans les infections ostéoarticulaires

Bactériémies à BGN

Le diagnostic de certitude des bactériémies à BGN est apporté par :

a) Les hémocultures
b) L'augmentation du taux des lactates dans le sang
c) La FNS
d) Le dosage de l'endotoxine dans le sang
e) Le bilan inflammatoire

Le traitement probabiliste des bactériémies à BGN peut faire appel à :

a) L'association C3G + aminoside
b) L'association macrolide + aminoside
c) L'association Vancomycine + aminoside
d) L'association Fluoroquinolones + aminoside
e) L'association Fluoroquinolones + Vancomycine

Concernant les bactériémies à bacilles GRAM négatifs (BGN):

a) Elles sont fréquentes en pathologie infectieuse
b) Le choc septique est la complication la plus grave
c) Les portes d'entrée cutanées sont les plus fréquentes
d) L'origine nosocomiale fait toute leur gravité
e) Les portes d'entrée dentaires sont fréquentes

Sepsis et choc septique

Parmi les éléments suivants lesquels définissent le sepsis:

a) Une fièvre à 40°C
b) Des signes d'infection associés à la dysfonction d'un organe
c) Une fréquence respiratoire à 30 cycles/mn associée à une bradycardie
d) Des signes d'infection associés à des convulsions
e) Une hypotension artérielle systolique abaissée

Parmi les éléments suivants lesquels définissent le choc septique:

a) Un taux de lactates > à 2 mmoles /L
b) Une pression artérielle systolique (PAS) < à 10
c) Un sepsis + PAM < 65 mm de Hg sous vasopresseurs + lactates > 2 mmoles /L
d) Une hypotension artérielle persistante malgré un remplissage bien conduit
e) Une artérielle diastolique abaissée

Le traitement du choc septique repose sur:

a) L'administration de drogues vasopressives sans remplissage vasculaire
b) Une Bi-antibiothérapie bactéricide et synergique seule
c) Le remplissage vasculaire + antibiothérapie + drogues vasopressives + oxygénothérapie + traitement de la PE
d) Un remplissage vasculaire à base de macromolécules
e) Toutes ces réponses sont justes

Rubéole

La rubéole est une maladie virale éruptive, immunisante qui se transmet:

a) Par voie respiratoire à partir d'un malade atteint de rubéole
b) Par le liquide des vésicules contenant le virus
c) Par le lait maternel
d) A partir d'un nouveau-né infecté
e) Par voie sexuelle

Toxoplasmose

Quelles sont parmi les mesures suivantes, celles que vous conseillez à une femme enceinte non immunisée contre la toxoplasmose:

a) De s'occuper régulièrement de son chat
b) De consommer de la viande bien cuite
c) De surveiller mensuellement sa sérologie jusqu'à l'accouchement
d) De bien laver les fruits et les légumes consommés crus
e) Toutes les réponses sont justes

La toxoplasmose de l'immunodéprimé peut se manifester par:

a) Des signes neurologiques chez le patient VIH
b) Des abcès hépatiques
c) Une atteinte cardiaque à type de péricardite
d) Une choriorétinite
e) Une hydrocéphalie ou microcéphalie chez le nouveau-né contaminé

Paludisme

Parmi les affirmations suivantes concernant le paludisme, lesquelles sont justes?

a) Le parasite est transmis par piqure de moustique du genre Anophèle
b) Le parasite est transmis par voie digestive
c) Son diagnostic doit être évoqué chez tout sujet revenant d'une zone d'endémie palustre
d) Plasmodium Falciparum peut être responsable d'encéphalopathie grave
e) Plasmodium falciparum peut être responsable d'accès de réviviscence

Concernant les modes de transmission du paludisme lesquels sont justes ?

a) La transfusion sanguine
b) La voie sexuelle
c) La voie trans-placentaire
d) La greffe d'organes
e) La voie digestive

Diphtérie

Quelles sont les caractéristiques des fausses membranes au cours d'une angine diphtérique ?

a) Elles sont cohérentes
b) Elles sont adhérentes
c) Elles sont extensives et ne se dissocient pas dans l'eau
d) Elles n'engainent jamais la luette
e) Elles sont de couleur jaunâtre

Quelles sont les complications que l'on peut rencontrer au cours de la diphtérie ?

a) La laryngite diphtérique ou Croup
b) La myocardite
c) La paralysie du voile du palais
d) Une polyradiculonévrite
e) Toutes les réponses sont justes

cholera

Parmi les signes suivants, lequel n'est pas retrouvé au cours du choléra ?

a) Les vomissements
b) La diarrhée
c) La déshydratation
d) La fièvre
e) La sécheresse des muqueuses

Toutes les propositions suivantes caractérisent le choléra sauf une. Laquelle ?

a) C'est une maladie très contagieuse
b) Le réservoir de germes est représenté par l'homme
c) La transmission est interhumaine
d) C'est une maladie à transmission oro-fécale
e) L'immunité conférée par le choléra est définitive

Streptococcies

Parmi les signes cliniques suivants lesquels évoquent une origine streptococcique ?

a) Un exanthème scarlatiniforme
b) Une angine purulente
c) Un érysipèle
d) Un sycosis de la barbe
e) Des furoncles

Parmi les signes cliniques suivants lesquels sont retrouvés au cours d'une scarlatine ?

a) Un exanthème avec intervalles de peau saine
b) Un exanthème sans intervalles de peau saine
c) Une peau rugueuse parsemée d'un fin granité
d) Une langue framboisé
e) Une angine à fausses membranes

Dermohypodermite

Quels sont parmi les facteurs suivants ceux qui favorisent la survenue d'un érysipèle ?

a) Un lymphœdème
b) Un intertrigo
c) L'obésité
d) Une varicelle
e) Une mauvaise hygiène

Infection à VIH&SIDA

Quel est parmi les modes de transmission suivants celui qui ne transmet pas le VIH ?

a) La transmission cutanée
b) La transmission sexuelle par les sécrétions vaginales
c) La transmission mère-enfant ou transmission verticale
d) La transmission par le sang
e) La transmission par les dérivés sanguins

Quelles sont les situations justifiant la prescription d'une sérologie VIH ?

a) Une fièvre au long cours
b) La grossesse
c) Une lymphopénie
d) Un zona chez un sujet âgé
e) Un accident d'exposition au sang

Quelles sont les infections qui peuvent être rencontrées au cours de l'infection VIH lorsque le taux de CD4 est situé entre 350 et 200?

a) La tuberculose
b) La toxoplasmose cérébrale
c) Les candidoses œsophagiennes
d) Les candidoses oro-pharyngées
e) La pneumocystose

La transmission du virus de l'immunodéficience humaine (VIH) est maximale:

a) Au premier trimestre de la grossesse
b) Au 2ème trimestre de la grossesse
c) Au 3ème trimestre de la grossesse
d) Au moment de l'accouchement
e) Toutes les réponses sont justes

Diarrhées infectieuses

Parmi les affections suivantes lesquelles sont à transmission hydrique?

a) Le paludisme
b) Le choléra
c) La fièvre typhoïde
d) La varicelle
e) Le tétanos

Méningite à liquide claire

Parmi les méningites suivantes laquelle est lymphocytaire hypoglycorachique ?

a) La méningite à pneumocoque
b) La méningite à méningocoque
c) La méningite tuberculeuse
d) La méningite ourlienne
e) La méningoencéphalite herpétique

Méningites purulentes

Quelles sont les affirmations justes concernant les contre-indications de la ponction lombaire ?

a) L'existence d'une HIC
b) Une infection du rachis au point de piqure
c) Des signes de focalisation
d) Une cyphoscoliose
e) Des troubles de l'hémostase

Au cours d'une épidémie de méningites à méningocoque, l'antibioprophylaxie repose sur:

a) La Spiramycine
b) La Vancomycine
c) La Pénicilline G
d) La Rifampicine
e) La fosfomycine

Le traitement d'une méningite à pneumocoque de sensibilité diminuée à la pénicilline repose sur:

a) Une Céphalosporine de 1ère génération
b) Une Céphalosporine de 3ème génération + aminoside
c) La Rifampicine + Bactrim
d) Une Céphalosporine de 3ème génération + vancomycine
e) L'Amoxicilline

Leptospirose

Toutes les propositions suivantes caractérisant la leptospirose sont justes sauf une laquelle ?

a) La fièvre continue, en plateau ou ondulante
b) La réaction méningée lymphocytaire
c) Une hépatonéphrite aigue
d) Une thrombopénie
e) Un ictère franc

Fièvre typhoide et paratyphoïde

Quelles sont les propositions justes concernant la fièvre typhoïde ?

a) La fièvre est en plateau avec un pouls dissocié
b) Les épistaxis ne sont pas caractéristiques
c) Les taches rosées lenticulaires sont pathognomoniques
d) Le tuphos survient au 1er septenaire
e) L'évolution spontanée est favorable

Le syndrome abdominal pseudo-perforatif au cours de la fièvre typhoïde:

a) Est dû à une libération importante d'endotoxine
b) Est observé dans des formes graves
c) Nécessite un arrêt de l'antibiothérapie
d) Nécessite de fortes doses d'antibiothérapie pour le prévenir
e) La corticothérapie est indiquée

Le diagnostic positif de fièvre typhoïde chez l'adulte repose sur:

a) Le frottis et goutte épaisse
b) L'hémoculture
c) La parasitologie des selles
d) La coproculture
e) Le sérodiagnostic de Wright

Tétanos

Cochez les réponses fausses concernant le Tétanos:

a) C'est une toxi-infection immunisante
b) Une incubation courte est un facteur de mauvais pronostic
c) Le diagnostic se base sur des prélèvements au niveau de la porte d'entrée
d) La tétanolysine est la toxine responsable de la symptomatologie
e) C'est une maladie qui peut être prévenue à 100% par une vaccination correcte

Brucellose

Cochez les réponses justes concernant la Brucellose:

a) La symptomatologie est marquée par la triade classique: frissons, fièvre, sueurs
b) Le sérodiagnostic de Wright est selon l'OMS la méthode diagnostic de référence
c) Le sérodiagnostic de Wright se positive vers les 12-15ème jour d'évolution
d) Le diagnostic de certitude repose sur l'hémoculture
e) C'est une bactériémie à point de départ lymphatique`;

const lines = text.split('\n').map(l => l.trim()).filter(l => l);

const lessons = [];
let currentLesson = null;
let currentMCQ = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const propMatch = line.match(/^([a-eA-E])\)\s+(.*)$/);
  
  if (propMatch) {
    if (currentMCQ) {
      currentMCQ.propositions.push({
        id: uuidv4(),
        letter: propMatch[1].toUpperCase(),
        text: propMatch[2]
      });
    }
  } else {
    if (line.endsWith(':') || line.endsWith('?') || line.length > 50) {
      if (!currentLesson) {
        currentLesson = { id: uuidv4(), title: 'General', mcqs: [] };
        lessons.push(currentLesson);
      }
      currentMCQ = {
        id: uuidv4(),
        stem: line,
        propositions: [],
        correctAnswers: [],
        explanation: ''
      };
      currentLesson.mcqs.push(currentMCQ);
    } else {
      currentLesson = {
        id: uuidv4(),
        title: line,
        mcqs: []
      };
      lessons.push(currentLesson);
    }
  }
}

// Fill missing propositions up to E
for (const lesson of lessons) {
  for (const mcq of lesson.mcqs) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    for (let i = mcq.propositions.length; i < 5; i++) {
      mcq.propositions.push({
        id: uuidv4(),
        letter: letters[i],
        text: ''
      });
    }
  }
}

const project = {
  version: 1,
  projectName: 'Maladies Infectieuses',
  lessons: lessons
};

fs.writeFileSync('src/data.json', JSON.stringify(project, null, 2));
