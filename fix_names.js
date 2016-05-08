function fixName(name) {

	var names = [

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
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['dkName'] === name) {

			return names[i]['batName'];
		}
	}

	return name;
}
