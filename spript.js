document.addEventListener("DOMContentLoaded", function() {
    const recomendaciones = [
        "🍜 No olvides hidratarte mientras ves anime.",
        "🚿 Recomendación del día: bañarse no mata waifus.",
        "📖 Lee el manga antes que lo arruinen en el anime.",
        "🎶 Aprende japonés escuchando openings en loop.",
        "🧼 Cambia la funda de tu almohada de waifu cada semana.",
        "😎 Ve Evangelion solo si estás emocionalmente preparado.",
        "🐸 Si ves anime con doblaje latino, ¡también eres otaku!",
        "🧠 Ver anime no te hace otaku, ¡amarlo sí!",
        "🔥 Naruto corriendo no te hará más rápido, pero sí más cool.",
        "💪 Haz sentadillas al ritmo de openings para ejercitarte otaku-style.",
        "🎭 No llores, no es real... ¡pero se siente real!",
        "👘 Todo mejora con un festival escolar en el episodio 12.",
        "🌕 Si ves la luna y recuerdas un anime, eres uno de los nuestros.",
        "📦 Deja espacio en tu cuarto, una figura nueva viene en camino.",
        "😳 Si te sonrojas viendo anime, ya no hay marcha atrás.",
        "🕶️ ‘Ore wa ochinchin ga daisuki nandayo’ – sabiduría pura.",
        "⏳ 5 minutos en un shonen pueden durar 3 capítulos. Prepárate.",
        "🛏️ Si dijiste ‘uno más’ a las 3 a.m., no estás solo.",
        "🎮 Un otaku que no juega algún JRPG… es raro, pero válido.",
        "🚪 Si tu mamá entra y escucha ‘oniichan’, no es lo que parece.",
        "🎧 Cuidado: algunos endings rompen el alma si los escuchas solo.",
        "🐱 Si tu gato se llama Nezuko o Goku, aprobamos.",
        "💪 Practicar poses de JoJo frente al espejo es válido.",
        "☠️ Ver One Piece completo debería darte un diploma honorario.",
        "🎁 Tu mejor regalo: merch del personaje que te hizo llorar.",
        "😴 Dormir abrazando tu body pillow no es raro… ¿o sí?",
        "🌀 Entras por curiosidad, sales sabiendo qué es un isekai.",
        "📺 Saltarse el opening es delito menor. Saltarse el ending, grave.",
        "🎯 Si tienes waifus pero no novia, vas bien.",
        "💻 Ver anime sin anuncios te da +10 de felicidad."
    ];

        const recomendacion = recomendaciones[Math.floor(Math.random() * recomendaciones.length)];
        document.getElementById("reco-aleatoria").textContent = recomendacion;
    });

