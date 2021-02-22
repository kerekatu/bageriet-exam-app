

VIGTIGT: 
HUSK at notere i rapporten, hvis du ændrer i backend/API - hvad du ændrer og hvorfor. 
- Og HUSK så også at aflevere din version af backenden.



----------------------------------------------------------------------------------------------------------------
------ START BACKEND: ------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

Produktion (der rettes ikke i backend): 
    npm run START

Developer (foretrukken hvis der skal rettes i backend - trækker på nodemon): 
    npm run devStart

Projektet kører på PORT 5033 - dvs. http://localhost:5033

Projektet benytter MongoDB - tjek .env-filen for at tilrette evt. path/sti til din MongoDB

Installer evt. extension: "MongoDB for VS Code" - den giver dig adgang til at kigge i din MongoDB direkte fra VS Code: 
    https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode 
    Og ellers brug MongoDB Compass eller en shell til at tjekke datagrundlaget



----------------------------------------------------------------------------------------------------------------
------ API - POSTMAN -------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

BRUG POSTMAN: til at teste API'et - både GET, POST, PUT, PATCH og DELETE
    - brug især Postman når du når til POST, PUT, DELETE - da det er her, du aflæser hvordan API'et forventer at modtage data

Filer til import i din egen Postman kan hentes i mappen: _OPSÆTNING/Postman

Du kan også se dokumentationen og ex på metoderne her:
        https://documenter.getpostman.com/view/12464673/TWDXoGrm



----------------------------------------------------------------------------------------------------------------
------ TEKSTER -------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

Forskellige opskrifter/produkter, ingredienser, nyheder mv. er allerede indsat i databasen. Flere af de længere tekster - fx nyheder - er html-formateret. 
    Dvs. at der indgår fx <br /> i teksten der, hvor der skal være linjeskift. Hvis et <br /> skal oversættes til et linjeskift, når du skriver teksten ud på siden
    kan du med fordel installere html-react-parser ... altså: 
    
        npm i html-react-parser

    Herefter importe i de components, hvor du har brug for det med:

        import parse from 'html-react-parser';

    Og "oversætte" teksterne med parse() fx hvis du har en nyhedstekst, som ligger i en state nyhed:

        parse(nyhed.nyhedstekst)

    Har du fulgt med i videoerne til Viborg Haveservice - den sidste del med CMS - så ved du, hvad det handler om ... tjek evt. videoerne igen.



----------------------------------------------------------------------------------------------------------------
------ IMAGES --------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

Alle uploadede (post og put) images/filer sendes til mappen /public/images. 
    - men vær obs på, at de hentes fra frontend med følgende adresse (hvis du ikke har ændret på PORT'en):

    http://localhost:5033/images/xxxxxxx.jpg



----------------------------------------------------------------------------------------------------------------
------ Login - session -----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

Som udgangspunkt er tjek af admin-routes slået fra i server.js - slå det til, når/hvis du er klar til det.

Alle routes med ordet *admin* er tænkt som routes, som kræver login = der skal være sat en session-cookie hos brugeren,
og at credentials sendes med i api-kald (fetch, axios mv.)

Et korrekt login (POST af brugers email og password) sætter en 24 timers session-cookie (stored i MongoDB).

Ved login skelnes ikke mellem de to brugerroller ADMIN og Medlem - men du har lov til at udvide backenden med denne ekstra relevante funktionalitet.
Et korrekt login responser brugerens oplysninger retur (tjek i Postman) - herunder også rollen ADMIN eller Medlem

Du må meget gerne rette i routes, tilpasse "admin" på routes, lave yderligere tjek
    fx om en rolle er Medlem el. ADMIN, eller om en bruger som skal slettes er logget ind som netop den bruger, som skal slettes osv. ... 

Du må selvfølgelig også gerne tilføje validering, skrue op for kontrol/sikkerhed mv. i routes, modeller mv. 

Der er minimum af kontrol på routes, data mv. så det er muligt at udføre funktionaliteter i frontend uden at være begrænset af 
    kontrol fra API'et. Men ved du, hvad du gør - så skru gerne op for sikkerhed, routes mv.

--> HUSK at aflevere din backend + notere i rapporten, hvis du har foretaget ændringer <--
    -----------------------------------------------------------------------------------



----------------------------------------------------------------------------------------------------------------
------ Brugere til login mv. (password krypteres så derfor vises de oprindelige her) ---------------------------
----------------------------------------------------------------------------------------------------------------

Rolle: ADMIN:

    "brugernavn": "xray",
    "email": "peter@bager.dk",
    "password": "admin123"

Rolle: Medlem:

    "brugernavn": "kokken",
    "email": "kokken@mail.com",
    "password": "kokken123"

    "brugernavn": "madmor",
    "email": "madmor@mail.com",
    "password": "laila123"

    "brugernavn": "havregrynskuglen",
    "email": "sanne@smorhoj.dk",
    "password": "sanne123"

    "brugernavn": "suppevisken",
    "email": "sha@mail.dk",
    "password": "suppe123"

Opret selv flere - eller ret passwords mv. til - tjek bruger-metoderne i Postman


----------------------------------------------------------------------------------------------------------------
------ Brugerroller mv. ----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

Der er to slags brugere - dvs. 2 slags "rolle" (se databasen eller i bruger-model):

    Medlem
    ADMIN

ADMIN: 
Administrator - tænkt som det man skal være for at kunne logge ind og have adgang til det hele - også opret ret og slet nyheder fx.
En ADMIN kan ikke slettes (du kan selv rette dette til i routes mv. hvis du er nået så langt, at du vil lave funktionalitet til at styre brugere, roller mv.)

Medlem: 
Er det alle kan blive ved at registrere sig på siden. Et Medlem skal ved login have adgang
til at rette og slette egne oplysninger - men ikke andres. Et Medlem skal kunne kommentere et produkt/en opskrift.

Som det er sat op nu, skelnes der ikke mellem de to roller - det eneste er, at en bruger med ADMIN-rolle ikke kan slettes.


----------------------------------------------------------------------------------------------------------------
------ Bruger + Kommentar + Produkt/opskrift -------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

De tre modeller hænger sammen. En bruger som kommenterer et produkt, efterlader et spor i alle tre modeller. Dog et inddirekte spor i Bruger, fordi 
kommentaren ikke gemmes i Bruger men som ref fra Kommentar til bruger.
Det har især betydning ifm:

    - hvis en bruger sletter sin profil -> alle hans kommentarer slettes i både Kommentar og i kommentar-array i Produkt
    - hvis en opskrift (et produkt) slettes -> slettes alle kommentarer knyttet til opskriften -> dermed forsvinder visse brugeres kommentarer
    - hvis en enkelt kommentar slettes, forsvinder den fra brugeren (inddirekte - kommentarerne er ikke direkte lejret i Bruger) og opskriften (i array'et med kommentarer).



----------------------------------------------------------------------------------------------------------------
------ Produkt + Kategori --------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

... hænger også sammen. Pas på med at slette en kategori som er knyttet til produkter - for så har du en masse produkter uden kategori.



----------------------------------------------------------------------------------------------------------------
------ Produkt + Produktingrediens -----------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------

... hænger sammen. Tjek yderligere i Postman og modeller i backend.