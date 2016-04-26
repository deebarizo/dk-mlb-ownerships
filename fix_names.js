function fixName(name) {

	var names = [

		{
			dkName: 'Adrián Béltre',
			csvName: 'Adrian Beltre'
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
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['dkName'] === name) {

			return names[i]['csvName'];
		}
	}

	return name;
}

