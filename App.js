Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:[
        {
            xtype: 'container',
            itemId: 'combobox-container'
        },
        {
            xtype: 'container',
            itemId: 'grid-container'
        },
        {
            xtype: 'container',
            itemId: 'text-container'
        }
        
    ],
    launch: function() {
        this.down('#combobox-container').add({
            xtype: 'rallyfieldvaluecombobox',
            itemId: 'priorityCombobox',
            fieldLabel: 'Filter by Priority:',
            model: 'Defect',
            field: 'Priority',
            //important to specify context particularly when using custom fields or customized standard fileds, to get allowed values from right workspace
            context: this.getContext().getDataContext(),  //returns obj containing workspace, proj, projectScopeUp and projectScopeDown properties
            listeners: {
                ready: this._onLoad,
                select:this._onSelect,
                scope: this
            }
        });
    },

    _onLoad: function() {
        this.down('#text-container').add({
                    xtype: 'component',
                    itemId: 'text',
                    html: "selected: " + this.down('rallyfieldvaluecombobox').getValue(),
                    width: 50,
                    margin: 10
        });
        this.down('#grid-container').add({
            xtype: 'rallygrid',
            columnCfgs: [
                'Name',
                'FormattedID',
                'Priority',
                'Severity'
            ],
            context: this.getContext(),
            storeConfig:{
                model: 'Defect',
                filters:[this._getPriorityFilter()]
            }
        });
    },

    _onSelect: function() {
        Ext.ComponentQuery.query('#text')[0].update("selected: " + this.down('rallyfieldvaluecombobox').getValue());
        var grid = this.down('rallygrid') ;
        var store = grid.getStore();
        store.clearFilter(true);
        store.filter(this._getPriorityFilter());
    } ,
    _getPriorityFilter: function() {
        return {
            property: 'Priority',
            operator: '=',
            value:  this.down('#priorityCombobox').getValue()
        };
    }
});
