use telovendoDB;
    if (!db.getCollectionNames().includes("users")) {
        db.createCollection("users");
        db.users.createIndex({ username: 1 }, { unique: true })
        db.users.createIndex({ email: 1 }, { unique: true })
        db.users.insertOne({
            username: "porfidev",
            name: "Porfirio",
            email: "hola@porfi.dev",
            password: "$2b$10$lhZcbp1b4OTY/rTD6rYECO3J.T5ErOb7tYqt1jXfz51fxZdcE6MQ."
            })
        print("Colección 'usuarios' creada.");
    } else {
        print("La colección 'usuarios' ya existe.");
    }

    if(!db.getCollectionNames().includes("consoles")) {
        db.createCollection("consoles");
    } else  {
        print("La colección 'consoles' ya existe.");
    }

    db.consoles.deleteMany({});
    print("Colección 'usuarios' vaciada.");
    db.consoles.insertMany([
        {
            name: "PlayStation 5",
            createdAt: new Date(),
            updatedAt: new Date(),
            },
        {
            name: "XBox Series X/S",
            createdAt: new Date(),
            updatedAt: new Date(),
            },
        {
            name: "Nintendo Switch",
            createdAt: new Date(),
            updatedAt: new Date(),
            },
        {
            name: "Nintendo Switch 2",
            createdAt: new Date(),
            updatedAt: new Date(),
            }
        ])
    print("La colección 'consoles' llena.");

    if(!db.getCollectionNames().includes("game_genres")) {
        db.createCollection("game_genres");
    } else  {
        print("La colección 'game_rengers' ya existe.");
    }

    db.getCollection("game_genres").deleteMany({});
    // Datos seed
    const genres = [
        { name: "Acción",            description: "Juegos centrados en rapidez y reflejos." },
        { name: "Aventura",          description: "Exploración, narrativa y resolución de problemas." },
        { name: "Rol (RPG)",         description: "Progresión de personajes, historia profunda y decisiones." },
        { name: "Shooter",           description: "Combate con armas de fuego en primera o tercera persona." },
        { name: "Plataformas",       description: "Saltos, niveles y precisión en obstáculos." },
        { name: "Estrategia",        description: "Planificación y toma de decisiones tácticas." },
        { name: "Sandbox / Mundo Abierto", description: "Libertad total para explorar y realizar actividades." },
        { name: "Deportes",          description: "Simulación de deportes como fútbol, basquet, etc." },
        { name: "Carreras",          description: "Juegos enfocados en competir en vehículos." },
        { name: "Survival Horror",   description: "Experiencias de terror, supervivencia y tensión constante." }
        ];

    // Insertar
    db.getCollection("game_genres").insertMany(genres);
