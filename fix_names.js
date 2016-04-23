function fixName(name) {

	var names = [

		{
			dkName: 'Adrián Béltre',
			batName: 'Adrian Beltre'
		},
		{
			dkName: 'José Altuve',
			batName: 'Jose Altuve'
		},
		{
			dkName: 'M. Bumgarner',
			batName: 'Madison Bumgarner'
		},
		{
			dkName: 'F. Liriano',
			batName: 'Francisco Liriano'
		},
		{
			dkName: 'J. Saltalamac...',
			batName: 'Jarrod Saltalamacchia'
		},
		{
			dkName: 'F. Cervelli',
			batName: 'Francisco Cervelli'
		},
		{
			dkName: 'G. Stanton',
			batName: 'Giancarlo Stanton'
		},
		{
			dkName: 'J. Hazelbaker',
			batName: 'Jeremy Hazelbaker'
		},
		{
			dkName: 'J. Hellickson',
			batName: 'Jeremy Hellickson'
		},
		{
			dkName: 'Adrián González',
			batName: 'Adrian Gonzalez'
		},
		{
			dkName: 'Carlos González',
			batName: 'Carlos Gonzalez'
		},
		{
			dkName: 'Gio González',
			batName: 'Gio Gonzalez'
		},
		{
			dkName: 'José Quintana',
			batName: 'Jose Quintana'
		}
	];

	for (var i = 0; i < names.length; i++) {
		
		if (names[i]['dkName'] === name) {

			return names[i]['batName'];
		}
	}

	return name;
}

