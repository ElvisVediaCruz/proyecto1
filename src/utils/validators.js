const validators = {
    validatePassword(password) {
        const errors = [];
        if (!password) {
            errors.push('La contraseña es requerida');
        } else {
            if (password.length < 8) {
                errors.push('Mínimo 8 caracteres');
            }
            if (password.length > 20) {
                errors.push('Máximo 20 caracteres');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Debe tener al menos una mayúscula');
            }
            if (!/[0-9]/.test(password)) {
                errors.push('Debe tener al menos un número');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    validateRegex(texto, pattern) {
        const patternT = pattern;
        return patternT.test(texto);
    },
    validateEmpleado(empleado, regexNumber, regexTexto){
        const ciValid = this.validateRegex(empleado.ci, regexNumber);
        const nombreValid = this.validateRegex(empleado.nombre, regexTexto);
        const apellidosValid = this.validateRegex(empleado.apellidos, regexTexto);
        const telefonoValid = this.validateRegex(empleado.telefono, regexNumber);
        const cargoValid = this.validateRegex(empleado.cargo, regexTexto);
        return {
            isValid: ciValid && nombreValid && apellidosValid && telefonoValid && cargoValid
        }
    },
    validateLogin(user, password){
        return (user.length > 0 && password.length > 0);
    }
}

export default validators;


//regex
/*
solo texto /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
mail /^[^\s@]+@[^\s@]+\.[^\s@]+$/
telefono /^\+?(\d.*){7,15}$/

*/ 