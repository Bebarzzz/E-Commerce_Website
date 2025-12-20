const Car = require('../../../Models/carModel');
const mongoose = require('mongoose');
require('../../setup');

describe('Car Model Unit Tests', () => {
  
  describe('Add New Car', () => {
    test('should create a new car with valid data', async () => {
      const car = await Car.addNewCar(
        'Camry',
        2023,
        'Toyota',
        'Sedan',
        30000,
        2.5,
        'FWD',
        'Gasoline',
        'Automatic',
        'new',
        ['https://example.com/image1.jpg']
      );
      
      expect(car).toBeDefined();
      expect(car.model).toBe('Camry');
      expect(car.brand).toBe('Toyota');
      expect(car.price).toBe(30000);
      expect(car.condition).toBe('new');
      expect(car.images).toHaveLength(1);
    });

    test('should accept used car condition', async () => {
      const car = await Car.addNewCar(
        'Accord',
        2020,
        'Honda',
        'Sedan',
        22000,
        2.0,
        'FWD',
        'Gasoline',
        'Automatic',
        'used'
      );
      
      expect(car.condition).toBe('used');
    });

    test('should normalize condition to lowercase', async () => {
      const car = await Car.addNewCar(
        'Civic',
        2022,
        'Honda',
        'Sedan',
        25000,
        1.8,
        'FWD',
        'Gasoline',
        'Manual',
        'NEW'
      );
      
      expect(car.condition).toBe('new');
    });

    test('should fail with missing model', async () => {
      await expect(
        Car.addNewCar(null, 2023, 'Toyota', 'Sedan', 30000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('All fields');
    });

    test('should fail with missing brand', async () => {
      await expect(
        Car.addNewCar('Camry', 2023, null, 'Sedan', 30000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('All fields');
    });

    test('should fail with negative price', async () => {
      await expect(
        Car.addNewCar('Camry', 2023, 'Toyota', 'Sedan', -1000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('Price must be a positive number');
    });

    test('should fail with zero price', async () => {
      await expect(
        Car.addNewCar('Camry', 2023, 'Toyota', 'Sedan', 0, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('Price must be a positive number');
    });

    test('should fail with negative engine capacity', async () => {
      await expect(
        Car.addNewCar('Camry', 2023, 'Toyota', 'Sedan', 30000, -2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('Engine capacity must be a positive number');
    });

    test('should fail with invalid condition', async () => {
      await expect(
        Car.addNewCar('Camry', 2023, 'Toyota', 'Sedan', 30000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'damaged')
      ).rejects.toThrow('Condition must be either "new" or "used"');
    });

    test('should fail with future manufacture year', async () => {
      const futureYear = new Date().getFullYear() + 1;
      await expect(
        Car.addNewCar('Camry', futureYear, 'Toyota', 'Sedan', 30000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('Manufacture year must be a valid year');
    });

    test('should fail with manufacture year before 1900', async () => {
      await expect(
        Car.addNewCar('Camry', 1899, 'Toyota', 'Sedan', 30000, 2.5, 'FWD', 'Gasoline', 'Automatic', 'new')
      ).rejects.toThrow('Manufacture year must be a valid year');
    });

    test('should create car without images', async () => {
      const car = await Car.addNewCar(
        'Camry',
        2023,
        'Toyota',
        'Sedan',
        30000,
        2.5,
        'FWD',
        'Gasoline',
        'Automatic',
        'new'
      );
      
      expect(car.images).toEqual([]);
    });
  });

  describe('Remove Car', () => {
    test('should remove an existing car', async () => {
      const car = await Car.addNewCar(
        'Camry',
        2023,
        'Toyota',
        'Sedan',
        30000,
        2.5,
        'FWD',
        'Gasoline',
        'Automatic',
        'new'
      );
      
      const result = await Car.removeCar(car._id.toString());
      
      expect(result.success).toBe(true);
      expect(result.deletedCar._id.toString()).toBe(car._id.toString());
      
      // Verify car is deleted
      const foundCar = await Car.findById(car._id);
      expect(foundCar).toBeNull();
    });

    test('should fail to remove non-existent car', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await Car.removeCar(fakeId.toString());
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    test('should fail with missing car ID', async () => {
      await expect(
        Car.removeCar(null)
      ).rejects.toThrow('A car ID is required for deletion');
    });

    test('should fail with invalid car ID format', async () => {
      await expect(
        Car.removeCar('invalid-id')
      ).rejects.toThrow('Invalid car ID format.');
    });
  });

  describe('Edit Car', () => {
    test('should update car with new data', async () => {
      const car = await Car.addNewCar(
        'Camry',
        2023,
        'Toyota',
        'Sedan',
        30000,
        2.5,
        'FWD',
        'Gasoline',
        'Automatic',
        'new'
      );
      
      const updateData = {
        price: 28000,
        condition: 'used'
      };
      
      const result = await Car.editCar(car._id.toString(), updateData);
      
      expect(result.success).toBe(true);
      expect(result.updatedCar.price).toBe(28000);
      expect(result.updatedCar.condition).toBe('used');
    });

    test('should fail to update non-existent car', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await Car.editCar(fakeId.toString(), { price: 25000 });
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    test('should fail with invalid car ID', async () => {
      await expect(
        Car.editCar('invalid-id', { price: 25000 })
      ).rejects.toThrow('Invalid car ID format.');
    });
  });

  describe('Car Schema Validation', () => {
    test('should have required fields', () => {
      const carSchema = Car.schema.obj;
      
      expect(carSchema.model.required).toBe(true);
      expect(carSchema.brand.required).toBe(true);
      expect(carSchema.price.required).toBe(true);
      expect(carSchema.manufactureYear.required).toBe(true);
    });

    test('should have condition enum', () => {
      const carSchema = Car.schema.obj;
      expect(carSchema.condition.enum).toContain('new');
      expect(carSchema.condition.enum).toContain('used');
    });

    test('should have timestamps', async () => {
      const car = await Car.addNewCar(
        'Test',
        2020,
        'Test Brand',
        'Sedan',
        20000,
        2.0,
        'FWD',
        'Gasoline',
        'Automatic',
        'new'
      );
      
      expect(car.createdAt).toBeDefined();
      expect(car.updatedAt).toBeDefined();
    });
  });
});
