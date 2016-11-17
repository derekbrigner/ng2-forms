import { Component, OnInit } from '@angular/core'; 
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'; 

@Component({
	selector: 'reactive-form',
	templateUrl: './app/reactive/reactive-form.component.html'
})
export class ReactiveFormComponent implements OnInit {
	form: FormGroup;

	formErrors = {
		name: '',
		username: '',
		addresses: [
			{city: '', country: ''}
		]
	};

	validationMessages = {
		name: {
			required: 'Name is required.',
			minlength: 'Name must be 3 characters.',
			maxlength: 'Name can\'t be longer than 6 characters.'
		},
		username: {
			required: 'User name is required.',
			minlength: 'Username must be 3 characters.'
		},
		addresses: {
			city: {
				required: 'City is required.',
				minlength: 'City must be 3 characters.'
			},
			country: {
				required: 'Country is required.'
			}
		}
	}

	constructor(private fb:FormBuilder) {}

	ngOnInit() {
		// build the data model for our form
		this.buildForm();
	}
	/*build the intial form*/
	buildForm() {
		//build our form
		this.form = this.fb.group({
			name: ['', [Validators.minLength(3), Validators.maxLength(6)]],
			username: ['', Validators.minLength(3)],
			addresses: this.fb.array([
				this.createAddress()
			])
		});
		console.log('this.form', this.form);

		// watch for chagnes and validate
		this.form.valueChanges.subscribe(data => this.validateForm());
	}
	/*validate the entire form*/
	validateForm() {
		for (let field in this.formErrors) {
			//clear that input field errors
			this.formErrors[field] = '';
			
			// grab an input field by name
			let input = this.form.get(field);

			if (input.invalid && input.dirty) {
				//figure out type of errors
				//loop over the formErrors field names
				for (let error in input.errors) {
					//assign that type of error message to an variable
					this.formErrors[field] = this.validationMessages[field][error];
				}
			}
		}

		this.validateAddresses();
	}
	/* 
	* validate the addresses form array 
	*/
	validateAddresses() {
		// grab the addresses form array
		let addresses = <FormArray>this.form.get('addresses');

		//clear the form errors
		this.formErrors.addresses = [];

		//loop through however many formgroups are in the formArrayName
		let n = 1;
		while(n <= addresses.length) {
			
			//add the clear errors back
			this.formErrors.addresses.push({city: '', country: ''});

			//grab the specific group (address)
			let address = <FormGroup>addresses.at(n - 1);

			// validate that specific group. loop through the groups controls
			for (let field in address.controls) {

				//get the formcontrol
				let input = address.get(field);

				//do the validation and save errors to the formerrors if necessary
				if(input.invalid && input.dirty) {
					for (let error in input.errors) {
						this.formErrors.addresses[n - 1][field] = this.validationMessages.addresses[field][error];
					}

				}
			}

			n++;
		}
	}

	createAddress() {
		return this.fb.group({
			city: ['', Validators.minLength(3)],
			country: ['']
		});
	}

	addAddress() {
		let addresses = <FormArray>this.form.get('addresses');
		addresses. push(this.createAddress());
	}
	removeAddress(i) {
		let addresses = <FormArray>this.form.get('addresses');
		addresses.removeAt(i);
	}

	processForm() {
		console.log('processing', this.form.value);
	}
}