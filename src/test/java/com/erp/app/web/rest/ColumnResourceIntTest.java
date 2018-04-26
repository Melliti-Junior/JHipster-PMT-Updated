package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Column;
import com.erp.app.repository.ColumnRepository;
import com.erp.app.repository.search.ColumnSearchRepository;
import com.erp.app.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static com.erp.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ColumnResource REST controller.
 *
 * @see ColumnResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class ColumnResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_MIN = 1;
    private static final Integer UPDATED_MIN = 2;

    private static final Integer DEFAULT_MAX = 1;
    private static final Integer UPDATED_MAX = 2;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private ColumnSearchRepository columnSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restColumnMockMvc;

    private Column column;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ColumnResource columnResource = new ColumnResource(columnRepository, columnSearchRepository);
        this.restColumnMockMvc = MockMvcBuilders.standaloneSetup(columnResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Column createEntity() {
        Column column = new Column()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .min(DEFAULT_MIN)
            .max(DEFAULT_MAX);
        return column;
    }

    @Before
    public void initTest() {
        columnRepository.deleteAll();
        columnSearchRepository.deleteAll();
        column = createEntity();
    }

    @Test
    public void createColumn() throws Exception {
        int databaseSizeBeforeCreate = columnRepository.findAll().size();

        // Create the Column
        restColumnMockMvc.perform(post("/api/columns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isCreated());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeCreate + 1);
        Column testColumn = columnList.get(columnList.size() - 1);
        assertThat(testColumn.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testColumn.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testColumn.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testColumn.getMax()).isEqualTo(DEFAULT_MAX);

        // Validate the Column in Elasticsearch
        Column columnEs = columnSearchRepository.findOne(testColumn.getId());
        assertThat(columnEs).isEqualToIgnoringGivenFields(testColumn);
    }

    @Test
    public void createColumnWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = columnRepository.findAll().size();

        // Create the Column with an existing ID
        column.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restColumnMockMvc.perform(post("/api/columns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isBadRequest());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = columnRepository.findAll().size();
        // set the field null
        column.setCode(null);

        // Create the Column, which fails.

        restColumnMockMvc.perform(post("/api/columns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isBadRequest());

        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllColumns() throws Exception {
        // Initialize the database
        columnRepository.save(column);

        // Get all the columnList
        restColumnMockMvc.perform(get("/api/columns?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(column.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].min").value(hasItem(DEFAULT_MIN)))
            .andExpect(jsonPath("$.[*].max").value(hasItem(DEFAULT_MAX)));
    }

    @Test
    public void getColumn() throws Exception {
        // Initialize the database
        columnRepository.save(column);

        // Get the column
        restColumnMockMvc.perform(get("/api/columns/{id}", column.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(column.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.min").value(DEFAULT_MIN))
            .andExpect(jsonPath("$.max").value(DEFAULT_MAX));
    }

    @Test
    public void getNonExistingColumn() throws Exception {
        // Get the column
        restColumnMockMvc.perform(get("/api/columns/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateColumn() throws Exception {
        // Initialize the database
        columnRepository.save(column);
        columnSearchRepository.save(column);
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();

        // Update the column
        Column updatedColumn = columnRepository.findOne(column.getId());
        updatedColumn
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .min(UPDATED_MIN)
            .max(UPDATED_MAX);

        restColumnMockMvc.perform(put("/api/columns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedColumn)))
            .andExpect(status().isOk());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate);
        Column testColumn = columnList.get(columnList.size() - 1);
        assertThat(testColumn.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testColumn.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testColumn.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testColumn.getMax()).isEqualTo(UPDATED_MAX);

        // Validate the Column in Elasticsearch
        Column columnEs = columnSearchRepository.findOne(testColumn.getId());
        assertThat(columnEs).isEqualToIgnoringGivenFields(testColumn);
    }

    @Test
    public void updateNonExistingColumn() throws Exception {
        int databaseSizeBeforeUpdate = columnRepository.findAll().size();

        // Create the Column

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restColumnMockMvc.perform(put("/api/columns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(column)))
            .andExpect(status().isCreated());

        // Validate the Column in the database
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteColumn() throws Exception {
        // Initialize the database
        columnRepository.save(column);
        columnSearchRepository.save(column);
        int databaseSizeBeforeDelete = columnRepository.findAll().size();

        // Get the column
        restColumnMockMvc.perform(delete("/api/columns/{id}", column.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean columnExistsInEs = columnSearchRepository.exists(column.getId());
        assertThat(columnExistsInEs).isFalse();

        // Validate the database is empty
        List<Column> columnList = columnRepository.findAll();
        assertThat(columnList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchColumn() throws Exception {
        // Initialize the database
        columnRepository.save(column);
        columnSearchRepository.save(column);

        // Search the column
        restColumnMockMvc.perform(get("/api/_search/columns?query=id:" + column.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(column.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].min").value(hasItem(DEFAULT_MIN)))
            .andExpect(jsonPath("$.[*].max").value(hasItem(DEFAULT_MAX)));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Column.class);
        Column column1 = new Column();
        column1.setId("id1");
        Column column2 = new Column();
        column2.setId(column1.getId());
        assertThat(column1).isEqualTo(column2);
        column2.setId("id2");
        assertThat(column1).isNotEqualTo(column2);
        column1.setId(null);
        assertThat(column1).isNotEqualTo(column2);
    }
}
