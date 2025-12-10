from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from datetime import date, timedelta
from .models import Todo
from .forms import TodoForm


class TodoModelTest(TestCase):
    """Test cases for the Todo model"""
    
    def setUp(self):
        """Set up test data"""
        self.todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date=date.today() + timedelta(days=7),
            is_resolved=False
        )
    
    def test_todo_creation(self):
        """Test creating a TODO with all fields"""
        self.assertEqual(self.todo.title, "Test TODO")
        self.assertEqual(self.todo.description, "Test description")
        self.assertFalse(self.todo.is_resolved)
        self.assertIsNotNone(self.todo.created_at)
    
    def test_todo_creation_minimal(self):
        """Test creating a TODO with only required fields"""
        minimal_todo = Todo.objects.create(title="Minimal TODO")
        self.assertEqual(minimal_todo.title, "Minimal TODO")
        self.assertEqual(minimal_todo.description, "")
        self.assertIsNone(minimal_todo.due_date)
        self.assertFalse(minimal_todo.is_resolved)
    
    def test_todo_str_representation(self):
        """Test string representation of TODO"""
        self.assertEqual(str(self.todo), "Test TODO")
    
    def test_todo_not_overdue_future_date(self):
        """Test that future due dates are not overdue"""
        self.assertFalse(self.todo.is_overdue)
    
    def test_todo_overdue_past_date(self):
        """Test that past due dates are marked as overdue"""
        overdue_todo = Todo.objects.create(
            title="Overdue TODO",
            due_date=date.today() - timedelta(days=1),
            is_resolved=False
        )
        self.assertTrue(overdue_todo.is_overdue)
    
    def test_todo_not_overdue_when_resolved(self):
        """Test that completed TODOs are not marked as overdue"""
        resolved_todo = Todo.objects.create(
            title="Resolved TODO",
            due_date=date.today() - timedelta(days=1),
            is_resolved=True
        )
        self.assertFalse(resolved_todo.is_overdue)
    
    def test_todo_ordering(self):
        """Test that TODOs are ordered by creation date (newest first)"""
        older_todo = Todo.objects.create(title="Older TODO")
        newer_todo = Todo.objects.create(title="Newer TODO")
        
        todos = Todo.objects.all()
        self.assertEqual(todos[0], newer_todo)
        self.assertEqual(todos[1], older_todo)


class TodoViewTest(TestCase):
    """Test cases for views"""
    
    def setUp(self):
        """Set up test client and test data"""
        self.client = Client()
        self.todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date=date.today() + timedelta(days=7)
        )
    
    def test_todo_list_view(self):
        """Test that list view displays TODOs"""
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test TODO")
        self.assertTemplateUsed(response, 'todos/todo_list.html')
    
    def test_todo_list_view_counts(self):
        """Test that list view shows correct counts"""
        Todo.objects.create(title="Completed TODO", is_resolved=True)
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.context['pending_count'], 1)
        self.assertEqual(response.context['resolved_count'], 1)
    
    def test_todo_create_view_get(self):
        """Test GET request to create view"""
        response = self.client.get(reverse('todo_create'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/todo_form.html')
    
    def test_todo_create_view_post(self):
        """Test POST request to create a new TODO"""
        data = {
            'title': 'New TODO',
            'description': 'New description',
            'due_date': date.today() + timedelta(days=5),
            'is_resolved': False
        }
        response = self.client.post(reverse('todo_create'), data)
        self.assertEqual(response.status_code, 302)  # Redirect after success
        self.assertTrue(Todo.objects.filter(title='New TODO').exists())
    
    def test_todo_update_view_get(self):
        """Test GET request to update view"""
        response = self.client.get(reverse('todo_update', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test TODO")
        self.assertTemplateUsed(response, 'todos/todo_form.html')
    
    def test_todo_update_view_post(self):
        """Test POST request to update a TODO"""
        data = {
            'title': 'Updated TODO',
            'description': 'Updated description',
            'due_date': date.today() + timedelta(days=10),
            'is_resolved': True
        }
        response = self.client.post(
            reverse('todo_update', args=[self.todo.pk]), 
            data
        )
        self.assertEqual(response.status_code, 302)  # Redirect after success
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated TODO')
        self.assertTrue(self.todo.is_resolved)
    
    def test_todo_delete_view_get(self):
        """Test GET request to delete view (confirmation page)"""
        response = self.client.get(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/todo_confirm_delete.html')
    
    def test_todo_delete_view_post(self):
        """Test POST request to delete a TODO"""
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)  # Redirect after success
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())
    
    def test_toggle_resolved_view(self):
        """Test toggling TODO resolved status"""
        initial_status = self.todo.is_resolved
        response = self.client.get(reverse('todo_toggle', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)  # Redirect after toggle
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.is_resolved, not initial_status)
    
    def test_empty_todo_list(self):
        """Test list view with no TODOs"""
        Todo.objects.all().delete()
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No TODOs yet!")


class TodoFormTest(TestCase):
    """Test cases for the TodoForm"""
    
    def test_form_valid_with_all_fields(self):
        """Test form is valid with all fields"""
        form_data = {
            'title': 'Test TODO',
            'description': 'Test description',
            'due_date': date.today() + timedelta(days=7),
            'is_resolved': False
        }
        form = TodoForm(data=form_data)
        self.assertTrue(form.is_valid())
    
    def test_form_valid_with_minimal_fields(self):
        """Test form is valid with only required fields"""
        form_data = {
            'title': 'Minimal TODO',
            'description': '',
            'due_date': '',
            'is_resolved': False
        }
        form = TodoForm(data=form_data)
        self.assertTrue(form.is_valid())
    
    def test_form_invalid_without_title(self):
        """Test form is invalid without title"""
        form_data = {
            'title': '',
            'description': 'Description without title',
            'is_resolved': False
        }
        form = TodoForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('title', form.errors)
    
    def test_form_widgets(self):
        """Test that form has correct widget classes"""
        form = TodoForm()
        self.assertIn('form-control', form.fields['title'].widget.attrs['class'])
        self.assertIn('form-control', form.fields['description'].widget.attrs['class'])


class TodoURLTest(TestCase):
    """Test cases for URL routing"""
    
    def setUp(self):
        """Create a test TODO for URL tests"""
        self.todo = Todo.objects.create(title="Test TODO")
    
    def test_list_url_resolves(self):
        """Test that list URL resolves correctly"""
        url = reverse('todo_list')
        self.assertEqual(url, '/')
    
    def test_create_url_resolves(self):
        """Test that create URL resolves correctly"""
        url = reverse('todo_create')
        self.assertEqual(url, '/create/')
    
    def test_update_url_resolves(self):
        """Test that update URL resolves correctly"""
        url = reverse('todo_update', args=[self.todo.pk])
        self.assertEqual(url, f'/update/{self.todo.pk}/')
    
    def test_delete_url_resolves(self):
        """Test that delete URL resolves correctly"""
        url = reverse('todo_delete', args=[self.todo.pk])
        self.assertEqual(url, f'/delete/{self.todo.pk}/')
    
    def test_toggle_url_resolves(self):
        """Test that toggle URL resolves correctly"""
        url = reverse('todo_toggle', args=[self.todo.pk])
        self.assertEqual(url, f'/toggle/{self.todo.pk}/')