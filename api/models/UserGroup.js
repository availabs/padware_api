module.exports = {

    schema: true,
  	migrate: "safe",
    autosubscribe: ['create','destroy', 'update'],
    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        displayName: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: ['mpo', 'state', 'sysAdmin','Test'],
            required: true
        }

    }
}
