function fixName(name) {

	var names = [

		{
			dkName: 'Andrés Blanco',
			csvName: 'Andres Blanco'
		},
		{
			dkName: 'Anibal Sánchez',
			csvName: 'Anibal Sanchez'
		},
		{
			dkName: 'E. Rodríguez',
			csvName: 'Eduardo Rodriguez'
		},
		{
			dkName: 'Hanley Ramírez',
			csvName: 'Hanley Ramirez'
		},
		{
			dkName: 'Julio Urías',
			csvName: 'Julio Urias'
		},
		{
			dkName: 'Seán Rodríguez',
			csvName: 'Sean Rodriguez'
		},
		{
			dkName: 'F. Gutiérrez',
			csvName: 'Franklin Gutierrez'
		},
		{
			dkName: 'Carlos Pérez',
			csvName: 'Carlos Perez'
		},
		{
			dkName: 'Steven Moyà',
			csvName: 'Steven Moya'
		},
		{
			dkName: 'Chris Giménez',
			csvName: 'Chris Gimenez'
		},
		{
			dkName: 'D. Mastroianni',
			csvName: 'Darin Mastroianni'
		},
		{
			dkName: 'José Ramírez',
			csvName: 'Jose Ramirez'
		},
		{
			dkName: 'Álex Ávila',
			csvName: 'Alex Avila'
		},
		{
			dkName: 'Carlos Martínez',
			csvName: 'Carlos Martinez'
		},
		{
			dkName: 'Carlos Sánchez',
			csvName: 'Carlos Sanchez'
		},
		{
			dkName: 'Adrián Béltre',
			csvName: 'Adrian Beltre'
		},
		{
			dkName: 'C. Granderson',
			csvName: 'Curtis Granderson'
		},
		{
			dkName: 'Yoenis Céspedes',
			csvName: 'Yoenis Cespedes'
		},
		{
			dkName: 'Yasmany Tomás',
			csvName: 'Yasmany Tomas'
		},
		{
			dkName: 'José Altuve',
			csvName: 'Jose Altuve'
		},
		{
			dkName: 'M. Bumgarner',
			csvName: 'Madison Bumgarner'
		},
		{
			dkName: 'F. Liriano',
			csvName: 'Francisco Liriano'
		},
		{
			dkName: 'J. Saltalamac...',
			csvName: 'Jarrod Saltalamacchia'
		},
		{
			dkName: 'F. Cervelli',
			csvName: 'Francisco Cervelli'
		},
		{
			dkName: 'G. Stanton',
			csvName: 'Giancarlo Stanton'
		},
		{
			dkName: 'J. Hazelbaker',
			csvName: 'Jeremy Hazelbaker'
		},
		{
			dkName: 'J. Hellickson',
			csvName: 'Jeremy Hellickson'
		},
		{
			dkName: 'Adrián González',
			csvName: 'Adrian Gonzalez'
		},
		{
			dkName: 'Carlos González',
			csvName: 'Carlos Gonzalez'
		},
		{
			dkName: 'Gio González',
			csvName: 'Gio Gonzalez'
		},
		{
			dkName: 'José Quintana',
			csvName: 'Jose Quintana'
		},
		{
			dkName: 'Grégory Polanco',
			csvName: 'Gregory Polanco'
		},
		{
			dkName: 'E. Encarnación',
			csvName: 'Edwin Encarnacion'
		},
		{
			dkName: 'José Lobatón',
			csvName: 'Jose Lobaton'
		},
		{
			dkName: 'Anthony Rendón',
			csvName: 'Anthony Rendon'
		},
		{
			dkName: 'M. A. Taylor',
			csvName: 'Michael A. Taylor'
		},
		{
			dkName: 'José Bautista',
			csvName: 'Jose Bautista'
		},
		{
			dkName: 'José Abreu',
			csvName: 'Jose Abreu'
		},
		{
			dkName: 'Bartolo Colón',
			csvName: 'Bartolo Colon'
		},
		{
			dkName: 'Eugenio Suárez',
			csvName: 'Eugenio Suarez'
		},
		{
			dkName: 'Javier Báez',
			csvName: 'Javier Baez'
		},
		{
			dkName: 'César Vargas',
			csvName: 'Cesar Vargas'
		},
		{
			dkName: 'S. Strasburg',
			csvName: 'Stephen Strasburg'
		},
		{
			dkName: 'Robinson Canó',
			csvName: 'Robinson Cano'
		},
		{
			dkName: 'Félix Hernández',
			csvName: 'Felix Hernandez'
		},
		{
			dkName: 'Héctor Santiago',
			csvName: 'Hector Santiago'
		},
		{
			dkName: 'Carlos Beltrán',
			csvName: 'Carlos Beltran'
		},
		{
			dkName: 'José Fernández',
			csvName: 'Jose Fernandez'
		},
		{
			dkName: 'Aarón Sánchez',
			csvName: 'Aaron Sanchez'
		},
		{
			dkName: 'Marwin González',
			csvName: 'Marwin Gonzalez'
		},
		{
			dkName: 'W. Castillo',
			csvName: 'Welington Castillo'
		},
		{
			dkName: 'Héctor Sánchez',
			csvName: 'Hector Sanchez'
		},
		{
			dkName: 'Salvador Pérez',
			csvName: 'Salvador Perez'
		},
		{
			dkName: 'C. Vázquez',
			csvName: 'Christian Vazquez'
		},
		{
			dkName: 'J.D. Martínez',
			csvName: 'J.D. Martinez'
		},
		{
			dkName: 'Hernán Pérez',
			csvName: 'Hernan Perez'
		},
		{
			dkName: 'César Hernández',
			csvName: 'Cesar Hernandez'
		},
		{
			dkName: 'I. De Jesús Jr.',
			csvName: 'Ivan De Jesus Jr.'
		},
		{
			dkName: 'Ramón Cabrera',
			csvName: 'Ramon Cabrera'
		},
		{
			dkName: 'Jaime García',
			csvName: 'Jaime Garcia'
		},
		{
			dkName: 'Eduardo Núñez',
			csvName: 'Eduardo Nunez'
		},
		{
			dkName: 'L. Chisenhall',
			csvName: 'Lonnie Chisenhall'
		},
		{
			dkName: 'Leonys Martín',
			csvName: 'Leonys Martin'
		},
		{
			dkName: 'René Rivera',
			csvName: 'Rene Rivera'
		},
		{
			dkName: 'José Iglesias',
			csvName: 'Jose Iglesias'
		},
		{
			dkName: 'Víctor Martínez',
			csvName: 'Victor Martinez'
		},
		{
			dkName: 'J. Bradley Jr.',
			csvName: 'Jackie Bradley Jr.'
		},
		{
			dkName: 'Ramón Flores',
			csvName: 'Ramon Flores'
		},
		{
			dkName: 'Avisail García',
			csvName: 'Avisail Garcia'
		},
		{
			dkName: 'A. Hechavarria',
			csvName: 'Adeiny Hechavarria'
		},
		{
			dkName: 'J. Giavotella',
			csvName: 'Johnny Giavotella'
		},
		{
			dkName: 'Kiké Hernández',
			csvName: 'Kike Hernandez'
		},
		{
			dkName: 'Y. Solarte',
			csvName: 'Yangervis Solarte'
		},
		{
			dkName: 'Pedro Álvarez',
			csvName: 'Pedro Alvarez'
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['dkName'] === name) {

			return names[i]['csvName'];
		}
	}

	return name;
}

function fixBatName(name) {

	var names = [

		{
			dkFixedName: 'Joe Ross',
			batName: 'Joseph Ross'
		},
		{
			dkFixedName: 'Jarrod Saltalamacchia',
			batName: 'Jarrod Saltalamacch...'
		},
		{
			dkFixedName: 'Jung Ho Kang',
			batName: 'Jung-Ho Kang'
		},
		{
			dkFixedName: 'Ivan De Jesus Jr.',
			batName: 'Ivan De Jesus'
		},
		{
			dkFixedName: 'Rickie Weeks Jr.',
			batName: 'Rickie Weeks'
		},
		{
			dkFixedName: 'Byung Ho Park',
			batName: 'Byung-ho Park'
		},
		{
			dkFixedName: 'Mike Bolsinger',
			batName: 'Michael Bolsinger'
		},
		{
			dkFixedName: 'Jackie Bradley Jr.',
			batName: 'Jackie Bradley'
		},
		{
			dkFixedName: 'Matt Szczur',
			batName: 'Matthew Szczur'
		},
		{
			dkFixedName: 'Mike Fiers',
			batName: 'Michael Fiers'
		},
		{
			dkFixedName: 'Kike Hernandez',
			batName: 'Enrique Hernandez'
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['batName'] === name) {

			return names[i]['dkFixedName'];
		}
	}

	return name;	
}

function fixTeamName(name) {

	var names = [

		{
			dkName: 'SF',
			batName: 'SFG'
		},
		{
			dkName: 'SD',
			batName: 'SDP'
		},
		{
			dkName: 'CWS',
			batName: 'CHW'
		},
		{
			dkName: 'KC',
			batName: 'KCR'
		},
		{
			dkName: 'TB',
			batName: 'TBR'
		},
		{
			dkName: 'Sea',
			batName: 'SEA'
		},
		{
			dkName: 'Mia',
			batName: 'MIA'
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['dkName'] === name) {

			return names[i]['batName'];
		}
	}

	return name;
}
