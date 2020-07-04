import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Field {

    getDateForm(item) {
        return (
            <FormGroup>
                <Label>{item.name}</Label>
                <Input key={item.id}
                    type="date"
                    name={item.name}
                    id={item.id}
                    placeholder="date placeholder"
                />
            </FormGroup>
        );
    }

    getTextForm(item) {
        return (
            <FormGroup key={item.id}>
                <Label>{item.name}</Label>
                <Input type="text" id={item.id} name={item.name} placeholder={item.placeholder} />
            </FormGroup>
        );
    }

    getSelectForm(item) {
        const values = "," + item.values;
        return (
            <FormGroup key={item.id}>
                <Label name={item.name}>{item.name}</Label>
                <Input type="select" id={item.id} placeholder={item.placeholder}>
                    {values.split(',').map((v, i) => { return <option key={i}>{v}</option> })}
                </Input>
            </FormGroup>
        );
    }

    getForm(item) {
        if (item.type === 'text') return this.getTextForm(item);
        else if (item.type === 'select') return this.getSelectForm(item);
        else if (item.type === 'date') return this.getDateForm(item);
    }

}