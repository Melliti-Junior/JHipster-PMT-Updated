package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Board;
import com.erp.app.repository.BoardRepository;
import com.erp.app.repository.search.BoardSearchRepository;
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
 * Test class for the BoardResource REST controller.
 *
 * @see BoardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class BoardResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardSearchRepository boardSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restBoardMockMvc;

    private Board board;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BoardResource boardResource = new BoardResource(boardRepository, boardSearchRepository);
        this.restBoardMockMvc = MockMvcBuilders.standaloneSetup(boardResource)
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
    public static Board createEntity() {
        Board board = new Board()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE);
        return board;
    }

    @Before
    public void initTest() {
        boardRepository.deleteAll();
        boardSearchRepository.deleteAll();
        board = createEntity();
    }

    @Test
    public void createBoard() throws Exception {
        int databaseSizeBeforeCreate = boardRepository.findAll().size();

        // Create the Board
        restBoardMockMvc.perform(post("/api/boards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(board)))
            .andExpect(status().isCreated());

        // Validate the Board in the database
        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeCreate + 1);
        Board testBoard = boardList.get(boardList.size() - 1);
        assertThat(testBoard.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBoard.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBoard.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the Board in Elasticsearch
        Board boardEs = boardSearchRepository.findOne(testBoard.getId());
        assertThat(boardEs).isEqualToIgnoringGivenFields(testBoard);
    }

    @Test
    public void createBoardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = boardRepository.findAll().size();

        // Create the Board with an existing ID
        board.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoardMockMvc.perform(post("/api/boards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(board)))
            .andExpect(status().isBadRequest());

        // Validate the Board in the database
        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = boardRepository.findAll().size();
        // set the field null
        board.setCode(null);

        // Create the Board, which fails.

        restBoardMockMvc.perform(post("/api/boards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(board)))
            .andExpect(status().isBadRequest());

        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllBoards() throws Exception {
        // Initialize the database
        boardRepository.save(board);

        // Get all the boardList
        restBoardMockMvc.perform(get("/api/boards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(board.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    public void getBoard() throws Exception {
        // Initialize the database
        boardRepository.save(board);

        // Get the board
        restBoardMockMvc.perform(get("/api/boards/{id}", board.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(board.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    public void getNonExistingBoard() throws Exception {
        // Get the board
        restBoardMockMvc.perform(get("/api/boards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateBoard() throws Exception {
        // Initialize the database
        boardRepository.save(board);
        boardSearchRepository.save(board);
        int databaseSizeBeforeUpdate = boardRepository.findAll().size();

        // Update the board
        Board updatedBoard = boardRepository.findOne(board.getId());
        updatedBoard
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE);

        restBoardMockMvc.perform(put("/api/boards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBoard)))
            .andExpect(status().isOk());

        // Validate the Board in the database
        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeUpdate);
        Board testBoard = boardList.get(boardList.size() - 1);
        assertThat(testBoard.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBoard.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBoard.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the Board in Elasticsearch
        Board boardEs = boardSearchRepository.findOne(testBoard.getId());
        assertThat(boardEs).isEqualToIgnoringGivenFields(testBoard);
    }

    @Test
    public void updateNonExistingBoard() throws Exception {
        int databaseSizeBeforeUpdate = boardRepository.findAll().size();

        // Create the Board

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBoardMockMvc.perform(put("/api/boards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(board)))
            .andExpect(status().isCreated());

        // Validate the Board in the database
        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteBoard() throws Exception {
        // Initialize the database
        boardRepository.save(board);
        boardSearchRepository.save(board);
        int databaseSizeBeforeDelete = boardRepository.findAll().size();

        // Get the board
        restBoardMockMvc.perform(delete("/api/boards/{id}", board.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean boardExistsInEs = boardSearchRepository.exists(board.getId());
        assertThat(boardExistsInEs).isFalse();

        // Validate the database is empty
        List<Board> boardList = boardRepository.findAll();
        assertThat(boardList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchBoard() throws Exception {
        // Initialize the database
        boardRepository.save(board);
        boardSearchRepository.save(board);

        // Search the board
        restBoardMockMvc.perform(get("/api/_search/boards?query=id:" + board.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(board.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Board.class);
        Board board1 = new Board();
        board1.setId("id1");
        Board board2 = new Board();
        board2.setId(board1.getId());
        assertThat(board1).isEqualTo(board2);
        board2.setId("id2");
        assertThat(board1).isNotEqualTo(board2);
        board1.setId(null);
        assertThat(board1).isNotEqualTo(board2);
    }
}
